import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getWatching } from '../../../lib/trakt'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const { username } = req.query

  try {
    const watching = await getWatching(username?.toString())
    if (watching) {
      return res.status(200).json(watching)
    } else {
      return res.status(204).end()
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message })
  }
}
