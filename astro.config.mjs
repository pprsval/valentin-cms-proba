import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';

const base = process.env.GITHUB_ACTIONS ? '/valentin-cms-proba' : '/';
const uploadPrefix = '../../uploads/';

function resolveUpload(node) {
  if (node.url.startsWith(uploadPrefix)) {
    return { ...node, url: base.replace(/\/$/, '') + '/uploads/' + node.url.slice(uploadPrefix.length) };
  }
}

export default defineConfig({
  base,
  markdown: {
    processor: satteri({
      mdastPlugins: [{ name: 'cms-uploads', image: resolveUpload, definition: resolveUpload }],
    }),
  },
});
