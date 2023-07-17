import api from '@/clientAPI'
import { Expense, ExpensePeriod, ExpenseSummary } from '@/types/api'
import { create } from 'zustand'

interface categoriesData {
  categorie: string
  totalAmount: number
}

interface CHART {
  categories: string[]
  daily: ExpenseSummary[]
  weekly: ExpenseSummary[]
  monthly: ExpenseSummary[]
  calendar: Expense[]
  topCategorieData: Expense[]
  undefinedCategorieData: Expense[]
  categoriesData: categoriesData[]

  getCategories(userId: string): void
  getExpenses(period: ExpensePeriod, userId: string): void
  getCalendar(year: number, month: number, userId: string): void
  getCategorieData(categorie: string, userId: string): void
}

export const chartStore = create<CHART>((set) => ({
  categories: [],
  daily: [],
  weekly: [],
  monthly: [],
  calendar: [],
  topCategorieData: [],
  undefinedCategorieData: [],
  categoriesData: [],
  getCategories: async (userId: string) => {
    const res = await api(`/api/categories?userId=${userId}`)
    set({
      categories: res.data
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

    const date = year.toString() + '-' + (month > 9 ? month.toString() : '0' + month.toString())

    if (Object.keys(res.data).length === 0) {
      return
    }
    console.log(res.data)

    let oneMonthCalender: Expense[] = []
    for (const key in res.data) {
      for (let i = 0; i < res.data[key].length; i++) {
        console.log(res.data[key][i])
        oneMonthCalender = [...oneMonthCalender, res.data[key][i]]
      }
    }
    console.log(oneMonthCalender)

    let categoriesData: categoriesData[] = []
    const categorie = await api(`/api/categories?userId=${userId}`)

    for (let i = 0; i < categorie.data.length; i++) {
      categoriesData[i] = { categorie: categorie.data[i], totalAmount: 0 }

      oneMonthCalender.map((data: Expense) => {
        if (data.category === categorie.data[i]) {
          categoriesData[i].totalAmount = categoriesData[i].totalAmount + data.amount
        }
      })
    }

    categoriesData.sort((a: categoriesData, b: categoriesData): number => {
      if (a.totalAmount > b.totalAmount) {
        return -1
      } else if (a.totalAmount < b.totalAmount) {
        return 1
      } else {
        return 0
      }
    })

    set({
      calendar: oneMonthCalender,
      categoriesData: categoriesData
    })
  },

  getCategorieData: async (categorie: string, userId: string) => {
    const res = await api(`/api/expenses/search?q=${categorie}&userId=${userId}`)

    console.log(res.data)

    res.data.sort((a: Expense, b: Expense): number => {
      if (a.date < b.date) {
        return -1
      } else if (a.date < b.date) {
        return 1
      } else {
        return 0
      }
    })

    if (categorie === 'undefined') {
      set({
        undefinedCategorieData: res.data
      })
      return
    }
    set({
      topCategorieData: res.data
    })
  }
}))
