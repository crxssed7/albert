import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getUserReadingList } from '../../../lib/anilist';
import getFirstMangaParkMatch from '../../../lib/mangapark';
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
  // trigger an update of the media list once an decimal chapter has been read. This
  // does not work if you've binge read a bunch of chapters for a manga that has a
  // last chapter as a decimal: e.g. last chapter is 80.5, you read chapters 75-80,
  // this will assume that you have also read 80.5 even though you haven't.
  const isDecimalChapter = mediaList.media.inferredChapterCount !== Math.floor(mediaList.media.inferredChapterCount);
  if (isDecimalChapter) {
    if (mediaList.updatedAt > (mediaList.media.mangaParkMatch?.uploadedAt ?? mediaList.updatedAt)) {
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
      mediaList.media.mangaParkMatch = null
    } else {
      const mangaParkMatch = await getFirstMangaParkMatch(mediaList.media.title.english ?? mediaList.media.title.romaji);
      mediaList.media.inferredChapterCount = mangaParkMatch?.lastChapter ?? null;
      mediaList.media.comickMatch = null
      mediaList.media.mangaParkMatch = mangaParkMatch
    }
  }

  if (only_unread) {
    readingList = readingList.filter(mediaList => !isRead(mediaList));
  }

  return res.json(readingList);
}
