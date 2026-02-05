import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getActiviesFromMedias, getManga } from '../../../lib/anilist';
import { convertNameToGraphqlSafe, getChaptersFromActivities, guessLatestChapter } from '../../../lib/helpers';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;
  let manga = await getManga(parseInt(id?.toString()));
  if (manga === null) {
    return res.status(404).json({ error: 'Manga not found' });
  }

  const activitiesResponse = await getActiviesFromMedias([{ id: manga.id, name: `${manga.title.english || manga.title.romaji}` }]);
  if (activitiesResponse && !manga.chapters) {
    const name = convertNameToGraphqlSafe(`${manga.title.english || manga.title.romaji}`);
    const activities = activitiesResponse.data[name].activities;
    const chapters = getChaptersFromActivities(activities);

    const guessed = guessLatestChapter(chapters)
    manga.inferredChapterCount = guessed?.chapter;
    manga.inferredChapterCountConfidence = guessed?.confidence ?? 0;
  } else if (manga.chapters) {
    manga.inferredChapterCount = manga.chapters;
    manga.inferredChapterCountConfidence = 100;
  } else {
    manga.inferredChapterCount = null;
    manga.inferredChapterCountConfidence = 0;
  }

  return res.json(manga);
}
