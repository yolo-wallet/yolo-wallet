import { NextApiRequest, NextApiResponse } from 'next'
import { getExpensesCalendarTransaction } from '@/transections/getExpense'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const expenses = await getExpensesCalendar(req)
    return res.status(201).json(expenses)
  }
  return res.status(200).send('foo')
}

async function getExpensesCalendar(req: NextApiRequest) {
  const year = req.query.year
  const month = req.query.month
  const userId = req.query.userId
  // prettier-ignore
  if (!year || typeof year === 'object' || !month || typeof month === 'object' || !userId || typeof userId === 'object') {
    return { code: 22, message: 'year, month, userId are required' }
  }
  return await getExpensesCalendarTransaction(year, month, userId)
}
