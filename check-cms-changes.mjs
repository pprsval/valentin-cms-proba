import { execFileSync } from 'node:child_process';

const git = (...args) => execFileSync('git', args, { encoding: 'utf8' });
const [mode, base, head] = process.argv.slice(2);
const allowed = /^(?:homepage\.json|src\/pages\/about\.md|src\/pages\/(?:blog|projects|hu)\/[^/]+\.md|public\/uploads\/.+)$/;

function changedCode(from, to) {
  return git('diff', '--no-renames', '--name-only', '-z', from, to)
    .split('\0').filter(file => file && !allowed.test(file));
}

function reject(files) {
  if (files.length) {
    throw new Error('CMS publication contains files outside the editable content: ' + files.join(', '));
  }
}

if (mode === 'draft') {
  reject(changedCode(git('merge-base', base, head).trim(), head));
} else if (mode === 'release') {
  // Start at the introduction of this guard, including for manual redeployments.
  const start = base === 'since-install'
    ? git('log', '--first-parent', '--diff-filter=A', '--format=%H', head, '--', 'check-cms-changes.mjs').trim().split('\n')[0]
    : base;
  if (!start) throw new Error('Missing publication audit starting point.');
  const history = git('log', '--first-parent', '--reverse', '--format=%H%x09%an%x09%s', start + '..' + head).trim();
  const unresolved = new Set();
  for (const line of history.split('\n').filter(Boolean)) {
    const [commit, author, subject] = line.split('\t');
    const cms = author === 'decap-turbo[bot]' || /Merged on Decap CMS|^Merge pull request #\d+ from .+\/cms\//.test(subject);
    if (!cms && !unresolved.size) continue;
    for (const file of changedCode(commit + '^1', commit)) {
      // A developer must subsequently address each affected path in a separate code change.
      if (cms) unresolved.add(file);
      else unresolved.delete(file);
    }
  }
  reject([...unresolved]);
} else {
  throw new Error('Expected draft or release followed by base and head commit IDs.');
}
