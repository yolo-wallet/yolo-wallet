import { NextApiRequest, NextApiResponse } from 'next'
import { NextRequest, NextResponse } from 'next/server'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
  }

  return res.status(200).send('foo')
}

function postExpenses() {
  // ...
}
