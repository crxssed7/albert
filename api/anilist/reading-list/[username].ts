import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getUserReadingList } from '../../../lib/anilist';
import { convertNameToGraphqlSafe, getActivitiesFromReadingList, getChaptersFromActivities, guessLatestChapter } from '../../../lib/helpers';
import { MediaListResponse } from '../../../lib/types';

function parseBoolean(value: string | string[] | undefined): boolean {
  return value === 'true' || value === '1';
}

function isRead(mediaList: MediaListResponse): boolean {
  if (!mediaList.media.inferredChapterCount) {
    return false;
  }

  return mediaList.progress >= mediaList.media.inferredChapterCount;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { username } = req.query;
  const only_unread = parseBoolean(req.query.only_unread);
  let readingList = await getUserReadingList(username?.toString());

  const activitiesResponse = await getActivitiesFromReadingList(readingList);
  for (const mediaList of readingList) {
    if (mediaList.media.chapters) {
      mediaList.media.inferredChapterCount = mediaList.media.chapters;
      mediaList.media.inferredChapterCountConfidence = 100;
    } else {
      if (!activitiesResponse) {
        mediaList.media.inferredChapterCount = null;
        mediaList.media.inferredChapterCountConfidence = 0;
        continue;
      }

      const name = convertNameToGraphqlSafe(`${mediaList.media.title.english || mediaList.media.title.romaji}`)
      const activities = activitiesResponse.data[name].activities
      const chapters = getChaptersFromActivities(activities)

      const guessed = guessLatestChapter(chapters)
      mediaList.media.inferredChapterCount = guessed?.chapter;
      mediaList.media.inferredChapterCountConfidence = guessed?.confidence ?? 0;
    }
  }

  if (only_unread) {
    readingList = readingList.filter(mediaList => !isRead(mediaList));
  }

  return res.json(readingList);
}
