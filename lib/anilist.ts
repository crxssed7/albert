import { Media, MediaListResponse } from "./types";

const mediaQuery = `
  {
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
    format
  }
`

export async function getUserReadingList(username: string): Promise<MediaListResponse[]> {
  const query = `
    query ($username: String) {
      Page(perPage: 50) {
        mediaList(userName: $username, status: CURRENT, type: MANGA) {
          media ${mediaQuery}
          progress
          updatedAt
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
      Media(id: $mediaId) ${mediaQuery}
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

export async function getUserFavourites(username: string): Promise<object[]> {
  const query = `
    query MyQuery($username: String) {
      User(name: $username) {
        favourites {
          manga {
            nodes {
              title {
                english
              }
              coverImage {
                medium
                large
              }
              id
            }
          }
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
  return json.data.User.favourites.manga.nodes;
}
