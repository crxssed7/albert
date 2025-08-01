# albert

Random APIs I use for personal projects. They might come in handy for you too.

## Available APIs

### AniList

Something that annoys me about AniList is the fact that it does not keep track of how many chapters are in a currently releasing manga. The AniList endpoints in albert all try to guess the number of chapters in a given manga by matching it up with a manga on Comick.

```
GET /api/anilist/manga/:id
```
Retrieve a specific manga from AniList. This includes two extra **nullable** fields, `comickMatch` and `inferredComicCount`:
```json
{
  "id": 30002,
  "title": {
    "romaji": "Berserk",
    "english": "Berserk"
  },
  "coverImage": {
    "large": "https://s4.anilist.co/file/anilistcdn/media/manga/cover/medium/bx30002-Cul4OeN7bYtn.jpg",
    "color": "#d6861a"
  },
  "chapters": null,
  "format": "MANGA",
  "inferredChapterCount": 382,
  "comickMatch": {
    "id": 574,
    "hid": "udwf1dTf",
    "slug": "01-berserk",
    "title": "Berserk",
    "lastChapter": 382,
    "uploadedAt": 1751099614
  }
}
```
If a manga is already completed **it will include a Comick match**. In that case, `inferredChapterCount` will be the same as `chapters`.

---

---
