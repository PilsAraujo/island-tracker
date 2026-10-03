import type { Weather } from './weather';

export const ANY_TIME = -1;

export interface Animal {
  slug: string;
  name: string;
  appears: number;
  disappears: number;
  weather: Weather | 'any';
}

type AnimalRow = [name: string, appears: number, disappears: number, weather: Weather | 'any'];

const RARE_ANIMAL_ROWS: AnimalRow[] = [
  ['Apkallu of Paradise', 12, 15, 'any'],
  ['Black Chocobo', ANY_TIME, ANY_TIME, 'clearSkies'],
  ['Dodo of Paradise', 15, 18, 'any'],
  ['Glyptodon', 0, 3, 'any'],
  ['Gold Back', ANY_TIME, ANY_TIME, 'rain'],
  ['Grand Buffalo', ANY_TIME, ANY_TIME, 'clouds'],
  ['Island Billy', 3, 6, 'any'],
  ['Island Stag', 18, 21, 'any'],
  ['Lemur', 6, 9, 'any'],
  ['Ornery Karakul', ANY_TIME, ANY_TIME, 'fairSkies'],
  ['Star Marmot', 9, 12, 'any'],
  ['Yellow Coblyn', ANY_TIME, ANY_TIME, 'fog'],
  ['Paissa', 12, 15, 'fairSkies'],
  ['Goobbue', 9, 12, 'clouds'],
  ['Beachcomb', 0, 3, 'rain'],
  ['Alligator', 6, 9, 'showers'],
  ['Twinklefleece', 18, 21, 'fog'],
  ['Griffin', 15, 18, 'clearSkies'],
  ['Tiger of Paradise', 18, 21, 'fairSkies'],
  ['Morbol Seedling', 3, 6, 'clouds'],
  ['Amethyst Spriggan', 21, 0, 'any'],
  ['Boar of Paradise', ANY_TIME, ANY_TIME, 'showers'],
  ['Weird Spriggan', 0, 3, 'fog'],
  ['Funguar', 15, 18, 'rain'],
  ['Alkonost', 21, 0, 'clearSkies'],
  ['Grand Doblyn', 3, 6, 'fairSkies'],
  ['Pteranodon', 9, 12, 'clearSkies'],
  ['Adamantoise', 12, 15, 'fog'],
  ['Morbol', 21, 0, 'showers'],
];

export function toSlug(name: string): string {
  return name.toLowerCase().replace(/ /g, '-');
}

export const RARE_ANIMALS: readonly Animal[] = RARE_ANIMAL_ROWS.map(([name, appears, disappears, weather]) => ({
  slug: toSlug(name),
  name,
  appears,
  disappears,
  weather,
}));

export function findRareAnimal(slug: string): Animal | undefined {
  return RARE_ANIMALS.find((animal) => animal.slug === slug);
}

const COMMON_ANIMAL_NAMES = [
  'Apkallu',
  'Aurochs',
  'Blue Back',
  'Chocobo',
  'Coblyn',
  'Glyptodon Pup',
  'Ground Squirrel',
  'Island Doe',
  'Island Nanny',
  'Lost Lamb',
  'Opo-opo',
  'Quartz Spriggan',
  'Wild Boar',
  'Wild Dodo',
];

export interface PastureAnimal {
  slug: string;
  name: string;
}

const byName = (a: PastureAnimal, b: PastureAnimal) => a.name.localeCompare(b.name);

export const COMMON_PASTURE_ANIMALS: readonly PastureAnimal[] = COMMON_ANIMAL_NAMES.map((name) => ({
  slug: toSlug(name),
  name,
})).sort(byName);

export const RARE_PASTURE_ANIMALS: readonly PastureAnimal[] = RARE_ANIMALS.map(({ slug, name }) => ({ slug, name })).sort(byName);

export function isPastureAnimalSlug(slug: string): boolean {
  return [...COMMON_PASTURE_ANIMALS, ...RARE_PASTURE_ANIMALS].some((animal) => animal.slug === slug);
}
