export interface ComickManga {
  id: number;
  hid: number;
  slug: string;
  title: string;
  lastChapter: number;
}

export interface MediaListResponse {
  media: Media
  progress: number
}

export interface Media {
  id: number
  title: {
    romaji: string
    english: string | null | undefined
  }
  coverImage: {
    large: string
    color: string | null | undefined
  }
  chapters: number | null | undefined
  format: 'MANGA' | 'NOVEL' | 'ONE_SHOT'
  inferredChapterCount: number | null | undefined
  comickMatch: ComickManga | null
}
