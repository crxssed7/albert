import { Media, MediaListResponse } from "./types";

export async function getUserReadingList(username: string): Promise<MediaListResponse[]> {
  const query = `
    query ($username: String) {
      Page(perPage: 50) {
        mediaList(userName: $username, status: CURRENT, type: MANGA) {
          media {
            id
            title {
              romaji
              english
            }
            coverImage {
              large
              color
            }
            chapters
          }
          progress
        }
      }
    }
  `
  const body = {
    query,
    variables: {
      username,
    },
  }
  const response = await fetch(`https://graphql.anilist.co`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(body),
  })
  if (!response.ok) {
    return [];
  }
  const json = await response.json();
  return json.data.Page.mediaList;
}

export async function getManga(mediaId: number): Promise<Media | null> {
  const query = `
    query ($mediaId: Int) {
      Media(id: $mediaId) {
        id
        title {
          romaji
          english
        }
        coverImage {
          large
          color
        }
        chapters
      }
    }
  `
  const body = {
    query,
    variables: {
      mediaId,
    },
  }
  const response = await fetch(`https://graphql.anilist.co`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(body),
  })
  if (!response.ok) {
    return null;
  }
  const json = await response.json();
  return json.data.Media;
}
