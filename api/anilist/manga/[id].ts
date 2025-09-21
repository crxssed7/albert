import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getManga, getUserReadingList } from '../../../lib/anilist';
import getFirstMangaParkMatch from '../../../lib/mangapark';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;
  let manga = await getManga(parseInt(id?.toString()));
  if (manga === null) {
    return res.status(404).json({ error: 'Manga not found' });
  }

  const mangaParkMatch = await getFirstMangaParkMatch(manga.title.romaji);
  manga.inferredChapterCount = mangaParkMatch?.lastChapter ?? null;
  manga.comickMatch = null;
  manga.mangaParkMatch = mangaParkMatch;

  return res.json(manga);
}
