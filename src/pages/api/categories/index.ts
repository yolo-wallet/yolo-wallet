import { NextApiRequest, NextApiResponse } from 'next'
import getCategoryByUserIdTransaction from '@/transections/getCategory'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const categories = await getCategoryByUserId(req, res)
    return res.status(200).json(categories)
  }
  return res.status(200).send('foo')
}

async function getCategoryByUserId(req: NextApiRequest, res: NextApiResponse) {
  const userId = req.query.userId ? (req.query.userId as string) : ''
  const response = await getCategoryByUserIdTransaction(userId)
  return response
}
