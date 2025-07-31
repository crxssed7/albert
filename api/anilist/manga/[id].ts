import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getManga, getUserReadingList } from '../../../lib/anilist';
import getFirstComickMatch from '../../../lib/comick';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;
  let manga = await getManga(parseInt(id?.toString()));
  if (manga === null) {
    return res.status(404).json({ error: 'Manga not found' });
  }

  const comickMatch = await getFirstComickMatch(manga.title.romaji);
  manga.inferredChapterCount = comickMatch?.lastChapter ?? null;
  manga.comickMatch = comickMatch

  return res.json(manga);
}
