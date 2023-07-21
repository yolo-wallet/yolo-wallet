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
    try {
      const res = await api.get<string[]>(`/api/categories?userId=${userId}`)
      set({ categoriesData: res.data.map((categorie) => ({ categorie, totalAmount: 0 })) })
    } catch (error) {
      console.error('Error getting categories:', error)
    }
  },
  getExpenses: async (period: ExpensePeriod, userId: string) => {
    try {
      const res = await api.get<ExpenseSummary>(`/expenses/summary?period=${period}&userId=${userId}`)
      set({ [period]: res.data })
    } catch (error) {
      console.error('Error getting expenses:', error)
    }
  },
  getCalendar: async (year: number, month: number, userId: string) => {
    try {
      const res = await api.get<{ [key: string]: Expense[] }>(`/expenses/calendar?year=${year}&month=${month}&userId=${userId}`)

      if (Object.keys(res.data).length === 0) {
        return
      }

      let oneMonthCalender: Expense[] = []
      for (const key in res.data) {
        oneMonthCalender = oneMonthCalender.concat(res.data[key])
      }

      let categories: string[] = [...new Set(oneMonthCalender.map((data) => data.category))]

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
    } catch (error) {
      console.error('Error getting calendar:', error)
    }
  },
  getCategorieData: async (categorie: string, userId: string) => {
    try {
      const res = await api.get<Expense[]>(`/api/expenses/search?q=${categorie}&userId=${userId}`)

      res.data.sort((a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf())

      if (categorie === 'undefined') {
        set({ daily: res.data })
      } else {
        set({ daily: res.data })
      }
    } catch (error) {
      console.error('Error getting category data:', error)
    }
  }
}))
