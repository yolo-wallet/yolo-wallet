import { create } from 'zustand'
import api from '@/clientAPI'
import dayjs from 'dayjs'
import { Expense, ExpensePeriod, ExpenseSummary } from '@/types/api'

interface CalendarStore {
  categoriesData: { categorie: string; totalAmount: number }[]
  daily: Expense[]
  weekly: Expense[]
  monthly: Expense[]
  getCategories: (userId: string) => void
  getExpenses: (period: ExpensePeriod, userId: string) => void
  getCalendar: (year: number, month: number, userId: string) => void
  getCategorieData: (categorie: string, userId: string) => void
}

export const useCalendarStore = create<CalendarStore>((set) => ({
  categoriesData: [],
  daily: [],
  weekly: [],
  monthly: [],
  getCategories: async (userId: string) => {
    const { data } = await api.get<string[]>(`/api/categories?userId=${userId}`)
    set({ categoriesData: data.map((categorie) => ({ categorie, totalAmount: 0 })) })
  },

  getExpenses: async (period: ExpensePeriod, userId: string) => {
    const { data } = await api.get<ExpenseSummary>(`/api/expenses/summary?period=${period}&userId=${userId}`)
    set({ [period]: data })
  },
  getCalendar: async (year: number, month: number, userId: string) => {
    const { data } = await api.get<Expense[]>(`api/expenses/calendar?year=${year}&month=${month}&userId=${userId}`)

    let oneMonthCalender: Expense[] = []
    for (let key in data) {
      oneMonthCalender = oneMonthCalender.concat(data[key])
    }

    let categories: string[] = oneMonthCalender.map((data) => data.category)

    let categoriesData: { categorie: string; totalAmount: number }[] = []

    for (let i = 0; i < categories.length; i++) {
      categoriesData[i] = { categorie: categories[i], totalAmount: 0 }
      oneMonthCalender.forEach((data: Expense) => {
        if (data.category === categories[i]) {
          categoriesData[i].totalAmount += data.amount
        }
      })
    }

    categoriesData.sort((a, b) => b.totalAmount - a.totalAmount)

    set({
      daily: oneMonthCalender,
      categoriesData: categoriesData
    })
  },
  getCategorieData: async (categorie: string, userId: string) => {
    const res = await api.get<Expense[]>(`/api/expenses/search?q=${categorie}&userId=${userId}`)

    res.data.sort((a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf())

    if (categorie === 'undefined') {
      set({ daily: res.data })
    } else {
      set({ daily: res.data })
    }
  }
}))