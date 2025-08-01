import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getUserReadingList } from '../../../lib/anilist';
import getFirstComickMatch from '../../../lib/comick';
import { MediaListResponse } from '../../../lib/types';

function parseBoolean(value: string | string[] | undefined): boolean {
  return value === 'true' || value === '1';
}

function isRead(mediaList: MediaListResponse): boolean {
  if (!mediaList.media.inferredChapterCount) {
    return false;
  }

  if (mediaList.progress < Math.floor(mediaList.media.inferredChapterCount)) {
    return false;
  }

  // If the last chapter is a decimal number, we check if the media list was updated
  // after the chapter was uploaded. We can then assume that the decimal chapter has
  // been read. We do this because AniList cannot track "half" chapters e.g. "80.5".
  // This is not 100% accurate but it's the closest we can get. Make sure to manually
  // trigger an update of the media list once an decimal chapter has been read.
  const isDecimalChapter = mediaList.media.inferredChapterCount !== Math.floor(mediaList.media.inferredChapterCount);
  if (isDecimalChapter) {
    if (mediaList.updatedAt > (mediaList.media.comickMatch?.uploadedAt ?? mediaList.updatedAt)) {
      return true;
    } else {
      return false;
    }
  }

  return true;
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
      const comickMatch = await getFirstComickMatch(mediaList.media.title.romaji, mediaList.media.format);
      mediaList.media.inferredChapterCount = comickMatch?.lastChapter ?? null;
      mediaList.media.comickMatch = comickMatch
    }
  }

  if (only_unread) {
    readingList = readingList.filter(mediaList => !isRead(mediaList));
  }

  return res.json(readingList);
}
