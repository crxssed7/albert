import { MangaParkManga } from './types';

const searchQuery = `query get_searchComic($select: SearchComic_Select) {
    get_searchComic(select: $select) {
        items {
            id
            data {
                dbStatus
                name
                urlPath
                max_chapterNode {
                    id
                    data {
                        id
                        dateCreate
                        dname
                    }
                }
            }
        }
    }
}`//.replace(/\s+/g, " ").trim();

function extractLastChapter(chapter: string): number | null {
  const regex = /(\d+(?:\.\d+)?)(?!.*\d)/gm;
  const result = regex.exec(chapter);
  if (!result) return null;
  return parseFloat(result[1]);
}

export default async function getFirstMangaParkMatch(title: string): Promise<MangaParkManga | null> {
  const body = {
    query: searchQuery,
    variables: {
      select: {
        word: title,
        size: 10,
        page: 1,
        sortby: "field_score"
      }
    },
  }

  const response = await fetch(`https://mangapark.io/apo/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Referer': 'https://mangapark.io/',
      "x-apollo-operation-name": "get_searchComic"
    },
    body: JSON.stringify(body).replace(/^\n|\n$/g, ''),
  })
  if (!response.ok) {
    return null;
  }

  const requestData = await response.json();
  const searchResults: Array<any> = requestData.data.get_searchComic.items;

  if (searchResults.length === 0) {
    return null;
  }

  const result = searchResults[0];
  const lastChapter = extractLastChapter(result.data.max_chapterNode.data.dname);
  return {
    id: parseFloat(result.id),
    urlPath: result.data.urlPath,
    title: result.data.name,
    lastChapter: lastChapter || 0,
    uploadedAt: Math.round(result.data.max_chapterNode.data.dateCreate / 1000)
  };
}
