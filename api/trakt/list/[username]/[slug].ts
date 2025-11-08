import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getListItems } from '../../../../lib/trakt';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { username, slug } = req.query;
  let list = await getListItems(username?.toString(), slug?.toString());
  return res.json(list);
}
