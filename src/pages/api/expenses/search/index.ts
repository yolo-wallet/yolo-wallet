import { NextApiRequest, NextApiResponse } from 'next'
import getAllExpensesByCategoryTransaction from '@/transections/getAllExpenses'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const expenses = await getAllExpensesByCategory(req, res)
    return res.status(200).json(expenses)
  }
  return res.status(200).send('foo')
}

async function getAllExpensesByCategory(req: NextApiRequest, res: NextApiResponse) {
  const category = req.query.q as string
  const userId = req.query.userId ? (req.query.userId as string) : ''
  const response = await getAllExpensesByCategoryTransaction(category, userId)
  return response
}
