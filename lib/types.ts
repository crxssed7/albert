export interface Activities {
  data: {
    [key: string]: {
      activities: { progress: string | null }[]
    }
  }
}

export interface MediaListResponse {
  media: Media
  progress: number
  updatedAt: number
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
  inferredChapterCountConfidence: number | null | undefined
}

export interface TraktListItem {
  rank: number
  id: number
  listed_at: string
  show: {
    title: string
    year: number
    ids: {
      trakt: number
      slug: string
      imdb: string
      tmdb: number
    }
  }
}
