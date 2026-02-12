import { getActiviesFromMedias } from "./anilist";
import { Activities, MediaListResponse } from "./types";

export function convertNameToGraphqlSafe(name: string): string {
  return name.replace(/[^a-zA-Z]/g, '').replace(/\s+/g, '_');
}

export async function getActivitiesFromReadingList(readingList: MediaListResponse[]): Promise<Activities | null> {
  const mediasWithNameAndId = readingList.map((entry) => {
    if (entry.media.chapters) {
      return { id: 0, name: "" };
    }
    return { id: entry.media.id, name: `${entry.media.title.english || entry.media.title.romaji}` }
  }).filter((item) => item.id !== 0);
  return await getActiviesFromMedias(mediasWithNameAndId);
}

export function guessLatestChapter(chapters: number[]): {chapter: number, confidence: number} | null {
  const tally: Record<number, number> = {}
  for (const chapter of chapters) {
    tally[chapter] = (tally[chapter] ?? 0) + 1
  }

  const scored = Object.keys(tally).map(Number).map(chapter => {
    return {
      chapter,
      score: tally[chapter] * Math.sqrt(chapter)
    }
  }).sort((a, b) => b.score - a.score)

  if (scored.length === 0) {
    return null;
  }

  const totalScore = scored.reduce((sum, c) => sum + c.score, 0)
  const top = scored[0]
  const confidence = Math.round((top.score / totalScore) * 100)

  return {chapter: top.chapter, confidence};
}

export function getChaptersFromActivities(activities: {progress: string | null;}[]): number[] {
  return activities.map((act) => {
    if (act.progress === null) {
      return 0;
    }
    const parts = act.progress.split(" - ")
    return parseFloat(parts[parts.length - 1])
  }).filter((num) => num !== 0)
}
