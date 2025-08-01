# albert

Random APIs I use for personal projects. They might come in handy for you too.

## Available APIs

### AniList

Something that annoys me about AniList is the fact that it does not keep track of how many chapters are in a currently releasing manga. The AniList endpoints in albert all try to guess the number of chapters in a given manga by matching it up with a manga on Comick.

```
GET /api/anilist/manga/:id
```
Retrieve a specific manga from AniList. This includes two extra **nullable** fields, `comickMatch` and `inferredComicCount`.
Example response:
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
If a manga is already completed **it will not include a Comick match**. In that case, `inferredChapterCount` will be the same as `chapters` and `comickMatch` will be null.

---

```
GET /api/anilist/reading-list/:username
```
Retrieve the list of manga the specified user is reading. This includes the `comickMatch` and `inferredChapterCount` fields. Depending on how many results are returned, the request may be slow as we need to contact the Comick API for each manga to retrieve a match. Set the `only_unread` query param to `true` or `1` to retrieve only the manga that the user has not fully read.
Example response:
```json
[
  {
    "media": {
      "id": 74347,
      "title": {
        "romaji": "One Punch-Man",
        "english": "One-Punch Man"
      },
      "coverImage": {
        "large": "https://s4.anilist.co/file/anilistcdn/media/manga/cover/medium/bx74347-sZpmNJ5xLwRK.jpg",
        "color": null
      },
      "chapters": null,
      "format": "MANGA",
      "inferredChapterCount": 150,
      "comickMatch": {
        "id": 80836,
        "hid": "Wz9Q5V2M",
        "slug": "02-one-punch-man-official",
        "title": "One Punch-Man (Official)",
        "lastChapter": 150,
        "uploadedAt": 1752579435
      }
    },
    "progress": 211,
    "updatedAt": 1735424878
  }
]
```
