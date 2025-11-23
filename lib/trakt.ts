import { TraktListItem } from "./types";

export async function getListItems(username: string, slug: string): Promise<TraktListItem[]> {
  const response = await fetch(`https://api.trakt.tv/users/${username}/lists/${slug}/items?extended=full,images`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'trakt-api-version': '2',
      // Go on then. Steal it. I don't care
      'trakt-api-key': '80385a95267fd85c22d380c508ee1aa687fc0aba899e3433a7df977ce0062e56'
    }
  })
  if (!response.ok) {
    return [];
  }
  return await response.json();
}

export async function getWatching(username: string): Promise<object | null> {
  const response = await fetch(`https://api.trakt.tv/users/${username}/watching`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'trakt-api-version': '2',
      'trakt-api-key': '80385a95267fd85c22d380c508ee1aa687fc0aba899e3433a7df977ce0062e56'
    }
  })
  if (response.status !== 200) {
    return null;
  }
  return await response.json();
}
