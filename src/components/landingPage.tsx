import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import dayjs from 'dayjs'
import useUserInfo from '@/hooks/useUserInfo'

const DatePicker = dynamic(() => import('antd').then((lib) => lib.DatePicker), {
  ssr: false,
  loading: () => <div>loading...</div>
})
const Input = dynamic(() => import('antd').then((lib) => lib.Input), {
  ssr: false,
  loading: () => <div>loading...</div>
})
const Button = dynamic(() => import('antd').then((lib) => lib.Button), {
  ssr: false,
  loading: () => <div>loading...</div>
})

interface Expense {
  userId: string
  amount: number
  category: string
  date: string
}

// interface GetCategoriesResponse {
//   categories: string[]
// }

export default function LandingPage () {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [date, setDate] = useState<string | null>(null)
  const [category, setCategory] = useState('')
  const [amount, setAmount] = useState('')
  const [searchKeyword, setSearchKeyword] = useState('')
  const [userinfo] = useUserInfo()

  useEffect (() => {
    fetchExpenses()
  }, [])

  const fetchExpenses = async (): Promise<void> => {
    try {
      const response = await fetch(`/api/expense?userId=${userinfo.userId}`)
      if (response.ok) {
        const data = await response.json()
        setExpenses(data)
      } else {
        console.error('Failed to fetch expenses:', response)
      }
    } catch (error) {
      console.error('Failed to fetch expenses:', error)
    }
  }

  const searchExpenses = async (): Promise<void> => {
    try {
      const response = await fetch(`/api/expenses/search?q=${searchKeyword}&userId=${userinfo.userId}`)
      if (response.ok) {
        const data = await response.json()
        setExpenses(data)
      } else {
        console.error('Failed to search expenses:', response)
      }
    } catch (error) {
      console.error('Failed to search expenses:', error)
    }
  }

  // const fetchCategories = async (): Promise<string[]> => {
  //   try {
  //     const response = await fetch(`/api/categories?userId=${userinfo.userId}`)
  //     if (response.ok) {
  //       const data: GetCategoriesResponse = await response.json()
  //       return data.categories
  //     } else {
  //       console.error('Failed to fetch categories:', response)
  //     }
  //   } catch (error) {
  //     console.error('Failed to fetch categories:', error)
  //   }
  //   return []
  // }

  const handleDateChange = (selectedDate: any) => {
    setDate(selectedDate?.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]') ?? null)
    console.log(typeof selectedDate)
  }

  const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCategory(event.target.value)
  }

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value)
  }
  const handleSearchKeywordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(event.target.value)
  }

  const addExpense = async () => {
    // 유효성 검사 (날짜, 분류, 금액이 모두 입력되었는지 확인)
    if (!date || category.trim() === '' || amount.trim() === '') {
      alert('날짜, 분류, 금액을 모두 입력해주세요.')
      return
    }

    const newExpense: Expense = {
      userId: userinfo.userId,
      amount: parseFloat(amount),
      category,
      date
    }
    console.log(newExpense)

    try {
      const response = await fetch('/api/expense', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newExpense)
      })

      if (response.status === 201) {
        // 추가 성공
        setDate(null)
        setCategory('')
        setAmount('')
        fetchExpenses()
      } else {
        // 추가 실패
        console.error('Failed to add expense:', response)
        alert('소비 기록 추가에 실패했습니다.')
      }
    } catch (error) {
      console.error('Failed to add expense:', error)
      alert('소비 기록 추가에 실패했습니다.')
    }
  }

  return (
    <div>
      <form className="flex items-center">
        <DatePicker onChange={handleDateChange} value={date ? dayjs(date) : null} />
        <Input className="w-48" value={category} onChange={handleCategoryChange} placeholder="분류" />
        <Input className="w-48" type="number" value={amount} onChange={handleAmountChange} placeholder="금액" />
        <div>
          <Button onClick={addExpense}>추가</Button>
        </div>
      </form>
      <div>
        <Input className="w-48" value={searchKeyword} onChange={handleSearchKeywordChange} placeholder="검색어" />
        <Button onClick={searchExpenses}>검색</Button>
      </div>

      <h2>지출 내역 리스트</h2>
      <ul>
        {expenses.map((expense, index) => (
          <li key={index}>
            <span>{expense.date}</span>
            <span>{expense.category}</span>
            <span>{expense.amount}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
