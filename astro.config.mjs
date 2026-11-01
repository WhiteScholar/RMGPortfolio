import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';

// SITE_ORIGIN and SITE_BASE are set by the GitHub Pages workflow.
// For a repo named <username>.github.io the base is "/"; for any other repo
// name it is "/<repo-name>".
const base = process.env.SITE_BASE || '/';

// Images inserted in a project's body text are saved by the CMS as "/images/...".
// Prefix them with the base path so they still work when the site isn't at the domain root.
function prefixBodyImages() {
  const prefix = base.replace(/\/$/, '');
  const walk = (node) => {
    if (node.tagName === 'img' && typeof node.properties?.src === 'string' && node.properties.src.startsWith('/') && !node.properties.src.startsWith('//')) {
      node.properties.src = prefix + node.properties.src;
    }
    node.children?.forEach(walk);
  };
  return () => (tree) => { if (prefix) walk(tree); };
}

export default defineConfig({
  site: process.env.SITE_ORIGIN || 'http://localhost:4321',
  base,
  markdown: {
    processor: unified({ rehypePlugins: [prefixBodyImages()] }),
  },
});
