export type SanityExpenseResponse = {
  _createdAt: string
  _id: string
  _rev: string
  _type: string
  _updatedAt: string
  amount: number
  category: string
  date: string
  user: {
    _ref: string
    _type: string
  }
}

export type Expense = {
  id: string
  userId: string
  category: string
  amount: number
  date: string
}

export type ExpenseSummary = {
  _id: string
  totalAmount: number
}

export type ExpenseRequestBody = Omit<Expense, 'id'>

export type ExpensePeriod = 'daily' | 'weekly' | 'monthly'

export type EditExpense = Partial<Expense> & {
  userId: string
}

export type ExpenseCalendar = {
  [key: string]: Expense[]
}
