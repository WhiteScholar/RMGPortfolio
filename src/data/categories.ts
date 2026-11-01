// The portfolio categories. To add one, add an entry here AND to the
// "category" options in .pages.yml so it shows up in the CMS.
export const categories = [
  { id: 'game-design', label: 'Game Design' },
  { id: 'graphic-design', label: 'Graphic Design' },
  { id: 'animation-2d', label: '2D Animation' },
  { id: 'animation-3d', label: '3D Animation' },
] as const;

export type CategoryId = (typeof categories)[number]['id'];

export const categoryIds = categories.map((c) => c.id) as [CategoryId, ...CategoryId[]];

export function categoryLabel(id: string) {
  return categories.find((c) => c.id === id)?.label ?? id;
}
