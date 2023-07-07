import { NextApiRequest, NextApiResponse } from 'next'
import { editExepnseByIdTransaction } from '@/transections/editExpense'
import { deleteExepnseByIdTransaction } from '@/transections/deleteExpense'
import { addExpeneseTransaction } from '@/transections/addExpense'
import { EditExpense, ExpenseRequestBody } from '@/types/api'

export type EditExpenseByIdRequestBody = {
  category?: string
  date?: string
  amount?: number
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const responseMessage = await addExpense(req)
    if (responseMessage.code) return res.status(400).send(responseMessage)
    return res.status(201).send(responseMessage)
  }

  if (req.method === 'PUT') {
    const responseMessage = await editExpenseById(req)
    if (responseMessage.code) return res.status(400).send(responseMessage)
    return res.status(201).json(responseMessage)
  }

  if (req.method === 'DELETE') {
    const reponseMessage = await deleteExpenseById(req)
    if (reponseMessage.code) return res.status(400).send(reponseMessage)
    return res.status(204).json(reponseMessage)
  }
  return res.status(200).send('foo')
}

async function addExpense(req: NextApiRequest) {
  const expenseRequestBody: ExpenseRequestBody = req.body
  return await addExpeneseTransaction(expenseRequestBody)
}

async function deleteExpenseById(req: NextApiRequest) {
  const id = req.query.expenseId
  if (!id || typeof id === 'object') return { code: 22, message: 'id is required' }
  return await deleteExepnseByIdTransaction(id)
}

async function editExpenseById(req: NextApiRequest) {
  const id = req.query.expenseId
  const body = req.body as EditExpense
  if (!id || typeof id === 'object') return { code: 22, message: 'id is required' }
  return await editExepnseByIdTransaction(id, body)
}
