import { execFileSync } from 'node:child_process';

const git = (...args) => execFileSync('git', args, { encoding: 'utf8' });
const [mode, base, head] = process.argv.slice(2);
const allowed = /^(?:homepage\.json|src\/pages\/about\.md|src\/pages\/(?:blog|projects|hu)\/[^/]+\.md|public\/uploads\/.+)$/;

function checkFiles(from, to) {
  const files = git('diff', '--no-renames', '--name-only', '-z', from, to).split('\0').filter(Boolean);
  const outside = files.filter(file => !allowed.test(file));
  if (outside.length) {
    throw new Error('CMS publication contains files outside the editable content: ' + outside.join(', '));
  }
}

if (mode === 'draft') {
  // Check the entire branch relative to its fork point, including renames and deletions.
  checkFiles(git('merge-base', base, head).trim(), head);
} else if (mode === 'release') {
  const commits = git('rev-list', '--first-parent', base + '..' + head).trim().split(/\s+/).filter(Boolean);
  for (const commit of commits) {
    const author = git('show', '-s', '--format=%an', commit).trim();
    const message = git('show', '-s', '--format=%B', commit);
    if (author === 'decap-turbo[bot]' || /Merged on Decap CMS|^Merge pull request #\d+ from [^\n]+\/cms\//m.test(message)) {
      checkFiles(commit + '^1', commit);
    }
  }
} else {
  throw new Error('Expected draft or release followed by base and head commit IDs.');
}
