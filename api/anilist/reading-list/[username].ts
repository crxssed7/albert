import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getUserReadingList } from '../../../lib/anilist';
import getFirstComickMatch from '../../../lib/comick';
import { MediaListResponse } from '../../../lib/types';

function parseBoolean(value: string | string[] | undefined): boolean {
  return value === 'true' || value === '1';
}

function isUnread(mediaList: MediaListResponse): boolean {
  return mediaList.progress < (mediaList.media.inferredChapterCount ?? mediaList.progress);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { username } = req.query;
  const only_unread = parseBoolean(req.query.only_unread);
  let readingList = await getUserReadingList(username?.toString());

  for (const mediaList of readingList) {
    if (mediaList.media.chapters) {
      mediaList.media.inferredChapterCount = mediaList.media.chapters;
      mediaList.media.comickMatch = null
    } else {
      const comickMatch = await getFirstComickMatch(mediaList.media.title.romaji);
      mediaList.media.inferredChapterCount = comickMatch?.lastChapter ?? null;
      mediaList.media.comickMatch = comickMatch
    }
  }

  if (only_unread) {
    readingList = readingList.filter(mediaList => isUnread(mediaList));
  }

  return res.json(readingList);
}
