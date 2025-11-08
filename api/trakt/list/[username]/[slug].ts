import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getListItems } from '../../../../lib/trakt'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const { username, slug } = req.query

  try {
    const list = await getListItems(username?.toString(), slug?.toString())
    return res.status(200).json(list)
  } catch (error: any) {
    return res.status(500).json({ error: error.message })
  }
}
