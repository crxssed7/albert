import { ComickManga } from './types';

export default async function getFirstComickMatch(title: string): Promise<ComickManga | null> {
  const response = await fetch(`https://api.comick.fun/v1.0/search/?page=1&limit=15&tachiyomi=true&showall=false&q=${encodeURIComponent(title)}&t=false&excludes=fan-colored&excludes=official-colored`);
  if (!response.ok) {
    return null;
  }

  const searchResults: Array<any> = await response.json();
  if (searchResults.length === 0) {
    return null;
  }

  const result = searchResults[0];
  return {
    id: result.id,
    hid: result.hid,
    slug: result.slug,
    title: result.title,
    lastChapter: result.last_chapter
  };
}
