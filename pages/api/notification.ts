// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
const fetch = require('node-fetch');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const content = req.body.content || 'Hello World!';

  await fetch(
    'https://discord.com/api/webhooks/1107774126627758110/y9JXW7mnt3E1KSU3HXXvwmSeqS3eoK_HW9gLSTWiH2ArGPZEVkQOD4_g3TffK08xGRjC',
    {
      method: 'POST',
      body: JSON.stringify({
        content,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  res.status(200).json('success');
}
