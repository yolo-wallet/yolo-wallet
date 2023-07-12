import api from '@/clientAPI'
import { ExpensePeriod, ExpenseSummary } from '@/types/api'
import { create } from 'zustand'

interface CHART {
  chartData: string[]
  daily: ExpenseSummary[]
  weekly: ExpenseSummary[]
  monthly: ExpenseSummary[]
  getCategories(userId: string): void
  getExpenses(period: ExpensePeriod, userId: string): void
  getCalendar(year: number, month: number, userId: string): void
}

export const chartStore = create<CHART>((set) => ({
  chartData: [],
  daily: [],
  weekly: [],
  monthly: [],
  getCategories: async (userId: string) => {
    const res = await api(`/api/categories?userId=${userId}`)
    console.log(res)
    set({
      chartData: res.data
    })
  },

  getExpenses: async (period: ExpensePeriod, userId: string) => {
    const res = await api(`/api/expenses/summary?period=${period}&userId=${userId}`)

    if (period === 'daily') {
      set({
        daily: res.data
      })
    } else if (period === 'weekly') {
      set({
        weekly: res.data
      })
    } else if (period === 'monthly') {
      set({
        monthly: res.data
      })
    }
  },

  getCalendar: async (year: number, month: number, userId: string) => {
    const res = await api(`/api/expenses/calendar?year=${year}&month=${month}&userId=${userId}`)
    console.log(res)
  }
}))
