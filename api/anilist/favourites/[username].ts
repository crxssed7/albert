import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getUserFavourites } from '../../../lib/anilist'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const { username } = req.query

  try {
    const list = await getUserFavourites(username?.toString())
    return res.status(200).json(list)
  } catch (error: any) {
    return res.status(500).json({ error: error.message })
  }
}
