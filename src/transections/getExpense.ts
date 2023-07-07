import dayjs from 'dayjs'
import client from '@/service/sanity'
import type { Expense, ExpenseCalendar, SanityExpenseResponse } from '@/types/api'
import { YOLO_USER_EXPENSES_DOC_TYPE } from '@/constants/constants'

export async function getExpensesCalendarTransaction(year: string, month: string, userId: string) {
  try {
    const query = `*[_type == "${YOLO_USER_EXPENSES_DOC_TYPE}" && user._ref == "${userId}"]`
    const response: SanityExpenseResponse[] = await client.fetch(query)
    const expenses: Expense[] = response.map((expense) => {
      return {
        id: expense._id,
        userId: expense.user._ref,
        date: expense._updatedAt,
        amount: expense.amount,
        category: expense.category
      }
    })

    const expenseCalendar: ExpenseCalendar = {}

    expenses
      .filter((expense) => {
        return dayjs(expense.date).format('YYYY') === year && Number(dayjs(expense.date).format('MM')) === Number(month)
      })
      .forEach((expense) => {
        const day = dayjs(expense.date).format('D')
        if (!expenseCalendar[day]) {
          expenseCalendar[day] = [expense]
          return
        }
        expenseCalendar[day].push(expense)
      })
    return expenseCalendar
  } catch (error) {
    console.error(error)
    return []
  }
}
