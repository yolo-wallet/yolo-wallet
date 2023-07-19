import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import dayjs from 'dayjs'
import useUserInfo from '@/hooks/useUserInfo'
import api from '@/clientAPI'

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
const Modal = dynamic(() => import('antd').then((lib) => lib.Modal), {
  ssr: false,
  loading: () => <div>loading...</div>
})
const Card = dynamic(() => import('antd').then((lib) => lib.Card), {
  ssr: false,
  loading: () => <div>loading...</div>
})

interface Expense {
  id: string
  userId: string
  amount: number
  category: string
  date: string | null
}

export default function LandingPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [date, setDate] = useState<string | null>(null)
  const [category, setCategory] = useState('')
  const [amount, setAmount] = useState('')
  const [searchKeyword, setSearchKeyword] = useState('')
  const [userinfo] = useUserInfo()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null)
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)

  useEffect(() => {
    fetchExpenses()
  }, [])

  const fetchExpenses = async (): Promise<void> => {
    let url = `/api/expenses/search?userId=${userinfo.userId}`
    if (searchKeyword) url += `&q=${encodeURIComponent(searchKeyword)}`
    const { data } = await api(url)
    setExpenses(data)
  }

  const searchExpenses = async (): Promise<void> => {
    fetchExpenses()
    /*
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
    */
  }

  const handleDateChange = (selectedDate: any) => {
    setDate(selectedDate?.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]') ?? null)
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
    if (!date || category.trim() === '' || amount.trim() === '') {
      alert('날짜, 분류, 금액을 모두 입력해주세요.')
      return
    }

    const newExpense: Expense = {
      id: '',
      userId: userinfo.userId,
      amount: parseFloat(amount),
      category,
      date
    }

    try {
      const response = await fetch('/api/expense', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newExpense)
      })

      if (response.status === 201) {
        setDate(null)
        setCategory('')
        setAmount('')
        fetchExpenses()
      } else {
        console.error('Failed to add expense:', response)
        alert('소비 기록 추가에 실패했습니다.')
      }
    } catch (error) {
      console.error('Failed to add expense:', error)
      alert('소비 기록 추가에 실패했습니다.')
    }
  }

  const updateExpense = async (expenseId: string, updatedExpense: Expense) => {
    try {
      const response = await fetch(`/api/expense/${expenseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedExpense)
      })

      if (response.status === 200) {
        fetchExpenses()
        closeModal()
      } else {
        console.error('Failed to update expense:', response)
        alert('소비 기록 수정에 실패했습니다.')
      }
    } catch (error) {
      console.error('Failed to update expense:', error)
      alert('소비 기록 수정에 실패했습니다.')
    }
  }

  const deleteExpense = async (expenseId: string) => {
    try {
      const response = await fetch(`/api/expense/${expenseId}`, {
        method: 'DELETE'
      })

      if (response.status === 200) {
        fetchExpenses()
        closeDeleteModal()
      } else {
        console.error('Failed to delete expense:', response)
        alert('소비 기록 삭제에 실패했습니다.')
      }
    } catch (error) {
      console.error('Failed to delete expense:', error)
      alert('소비 기록 삭제에 실패했습니다.')
    }
  }

  const openModal = (expense: Expense) => {
    setSelectedExpense(expense)
    setIsModalVisible(true)
  }

  const closeModal = () => {
    setSelectedExpense(null)
    setIsModalVisible(false)
  }

  const openDeleteModal = (expense: Expense) => {
    setSelectedExpense(expense)
    setIsDeleteModalVisible(true)
  }

  const closeDeleteModal = () => {
    setSelectedExpense(null)
    setIsDeleteModalVisible(false)
  }

  const handleUpdateExpense = () => {
    if (!selectedExpense) return

    const updatedExpense: Expense = {
      id: selectedExpense.id,
      userId: selectedExpense.userId,
      amount: parseFloat(amount),
      category,
      date
    }

    updateExpense(selectedExpense.id, updatedExpense)
  }

  const handleDeleteExpense = () => {
    if (!selectedExpense) return

    deleteExpense(selectedExpense.id)
  }

  return (
    <div>
      <div>
        <form className="flex items-center">
          <DatePicker onChange={handleDateChange} value={date ? dayjs(date) : null} />
          <Input className="w-48" value={category} onChange={handleCategoryChange} placeholder="분류" />
          <Input className="w-48" type="number" value={amount} onChange={handleAmountChange} placeholder="금액" />
          <div>
            <Button onClick={addExpense}>추가</Button>
          </div>
          <div>
            <Input className="w-48" value={searchKeyword} onChange={handleSearchKeywordChange} placeholder="검색어" />
            <Button onClick={searchExpenses}>검색</Button>
          </div>
        </form>
      </div>

      <h2>지출 내역 리스트</h2>
      <ul>
        {expenses.map((expense) => (
          <Card key={expense.id}>
            <span>{expense.date}</span>
            <span>{expense.category}</span>
            <span>{expense.amount}</span>
            <Button onClick={() => openModal(expense)}>수정</Button>
            <Button onClick={() => openDeleteModal(expense)}>삭제</Button>
          </Card>
        ))}
      </ul>

      <Modal
        title="소비 기록 수정"
        open={isModalVisible}
        onCancel={closeModal}
        onOk={handleUpdateExpense}
        destroyOnClose
      >
        {selectedExpense && (
          <div>
            <DatePicker onChange={handleDateChange} value={date ? dayjs(date) : null} />
            <Input className="w-48" value={category} onChange={handleCategoryChange} placeholder="분류" />
            <Input className="w-48" type="number" value={amount} onChange={handleAmountChange} placeholder="금액" />
          </div>
        )}
      </Modal>

      <Modal
        title="소비 기록 삭제"
        open={isDeleteModalVisible}
        onCancel={closeDeleteModal}
        onOk={handleDeleteExpense}
        destroyOnClose
      >
        <p>정말 삭제하시겠습니까?</p>
      </Modal>
    </div>
  )
}
