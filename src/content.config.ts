import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { categoryIds } from './data/categories';

// The CMS may save empty fields as "" or null, so optional fields accept both.
const optionalText = z.string().nullish().transform((v) => v || undefined);
const list = <T extends z.ZodType>(item: T) => z.array(item).nullish().transform((v) => v ?? []);

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    category: z.enum(categoryIds),
    summary: z.string(),
    cover: z.string(),
    date: z.coerce.date(),
    featured: z.boolean().nullish().transform((v) => v ?? false),
    draft: z.boolean().nullish().transform((v) => v ?? false),
    pixelArt: z.boolean().nullish().transform((v) => v ?? false),
    role: optionalText,
    tools: list(z.string()),
    itchUrl: optionalText,
    videoUrl: optionalText,
    gallery: list(z.object({ image: z.string(), caption: optionalText })),
    links: list(z.object({ label: z.string(), url: z.string() })),
    // Interactive 3D book (see src/components/BookMockup.astro). The CMS may save an
    // empty object, so it only counts as set when the assets folder is filled in.
    bookMockup: z
      .object({ assets: optionalText, flat: optionalText })
      .nullish()
      .transform((v) => (v?.assets ? { assets: v.assets, flat: v.flat } : undefined)),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    portrait: optionalText,
    resume: optionalText,
  }),
});

export const collections = { projects, pages };
