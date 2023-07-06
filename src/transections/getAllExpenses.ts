import { YOLO_USER_EXPENSES_DOC_TYPE } from './../constants/constants'
import client from '@/service/sanity'

type Expense = {
  date: string
  _createdAt: string
  _type: string
  amount: number
  _rev: string
  _id: string
  category: string
  _updatedAt: string
  user: { _ref: string; _type: string }
}

export type ExpenseResponse = {
  id: string
  userId: string
  date: string
  amount: number
  category: string
}
export default async function getAllExpensesByCategoryTransaction(
  category: string
) {
  try {
    // todo : filter 쿼리 추가하기
    const expenses = await client.fetch(
      `*[_type == "${YOLO_USER_EXPENSES_DOC_TYPE}"]`
    )
    return expenses
      .map((expense: Expense) => {
        return {
          id: expense._id,
          userId: expense.user._ref,
          date: expense.date,
          amount: expense.amount,
          category: expense.category,
        }
      })
      .filter((expense: ExpenseResponse) => {
        if (!category) return expense
        return expense.category === category
      })
  } catch (error) {
    console.error(error)
    return []
  }
}
