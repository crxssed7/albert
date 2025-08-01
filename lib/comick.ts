import { ComickManga } from './types';

export default async function getFirstComickMatch(title: string, format: 'MANGA' | 'NOVEL' | 'ONE_SHOT'): Promise<ComickManga | null> {
  const excludes = ['fan-colored', 'official-colored'];
  if (format !== 'ONE_SHOT') { excludes.push('oneshot'); }
  const response = await fetch(`https://api.comick.fun/v1.0/search/?page=1&limit=15&tachiyomi=true&showall=false&q=${encodeURIComponent(title)}&t=false&excludes=${excludes.join('&excludes=')}`);
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
    lastChapter: result.last_chapter,
    uploadedAt: Math.round(Date.parse(result.uploaded_at) / 1000),
  };
}
