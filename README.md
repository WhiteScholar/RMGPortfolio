# Portfolio

Built with [Astro](https://astro.build), edited with [Pages CMS](https://pagescms.org), hosted on GitHub Pages.

## Editing content (no code needed)

1. Go to <https://app.pagescms.org> and sign in with GitHub.
2. Open this repository.
3. Use **Projects** to add or edit portfolio entries, **About page** for your bio, and **Site settings** for your name, tagline, email and links.

When you save, Pages CMS commits to GitHub and the site rebuilds automatically within a minute or two.
To check progress, look at the **Actions** tab on GitHub.

### Project fields

- **Category**: decides which filter the project appears under.
- **Featured**: puts the project at the top of the grid.
- **Draft**: hides the project from the site without deleting it.
- **itch.io link**: adds a "Play on itch.io" button.
- **Video**: a YouTube or Vimeo link. The video replaces the cover image on the project page.
- **Gallery**: screenshots and stills. Click one to view it full size.

## Running it locally

```bash
npm install
npm run dev
```

Then open <http://localhost:4321>.

## Adding a category

Add it in `src/data/categories.ts` and in the `category` options in `.pages.yml`.
