import { getCollection, type CollectionEntry } from 'astro:content';

export type Project = CollectionEntry<'projects'>;

/** Prefix a site path with the base path; external URLs pass through untouched. */
export function url(path = '') {
  if (/^([a-z]+:)?\/\//i.test(path) || path.startsWith('mailto:')) return path;
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}/${path.replace(/^\//, '')}`;
}

/** Published projects: featured first, then newest first. */
export async function getProjects(category?: string) {
  const all = await getCollection('projects', (p) => !p.data.draft && (!category || p.data.category === category));
  return all.sort(
    (a, b) => Number(b.data.featured) - Number(a.data.featured) || b.data.date.getTime() - a.data.date.getTime(),
  );
}

/** Turn a YouTube or Vimeo link into an embeddable player URL. */
export function videoEmbedUrl(link: string) {
  const yt = link.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}`;
  const vimeo = link.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return undefined;
}

/** Video files uploaded directly (rather than YouTube/Vimeo links). */
export function isVideoFile(link: string) {
  return /\.(mp4|webm|mov)$/i.test(link);
}
