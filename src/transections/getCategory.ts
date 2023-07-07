import { YOLO_USER_EXPENSES_DOC_TYPE } from './../constants/constants'
import client from '@/service/sanity'
import { ExpenseResponse } from './getAllExpenses'

export default async function getCategoryByUserIdTransaction(userId: string) {
  try {
    const userExpenses = await client.fetch(`*[_type == "${YOLO_USER_EXPENSES_DOC_TYPE}" && user._ref == "${userId}"]`)
    const categories = new Set<string>()
    userExpenses.forEach((expense: ExpenseResponse) => categories.add(expense.category))
    return [...categories]
  } catch (error) {
    console.error(error)
    return []
  }
}
