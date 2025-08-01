import { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (req.headers.authorization) {
    headers['Authorization'] = req.headers.authorization;
  }
  const response = await fetch('https://api.hardcover.app/v1/graphql', {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(req.body),
  });

  if (response.headers.get('Content-Type') === 'application/json') {
    const json = await response.json();
    return res.status(response.status).json(json);
  }

  const text = await response.text();
  return res.status(response.status).send(text);
}
