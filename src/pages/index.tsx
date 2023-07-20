import React, { useState, useEffect } from 'react'
import dayjs, { Dayjs } from 'dayjs'
import useUserInfo from '@/hooks/useUserInfo'
import api from '@/clientAPI'
import { Expense, ExpenseRequestBody } from '@/types/api'

import RootLayout from '@/components/Layout'
import { DatePicker } from '@/components/Landing.tsx/DatePicker'
import { Input } from '@/components/Landing.tsx/Input'
import { Button } from '@/components/Landing.tsx/Button'
import { Card } from '@/components/Landing.tsx/Card'
import { Modal } from '@/components/Landing.tsx/Modal'

export default function LandingPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [date, setDate] = useState<string | null>(null)
  const [category, setCategory] = useState('')
  const [amount, setAmount] = useState('')
  const [searchKeyword, setSearchKeyword] = useState('')
  const [userinfo, isLoading] = useUserInfo()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null)
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)

  useEffect(() => {
    if (isLoading || !userinfo.name) return
    fetchExpenses()
  }, [userinfo.userId, isLoading])

  const fetchExpenses = async () => {
    let url = `/api/expenses/search?userId=${userinfo.userId}`
    if (searchKeyword) url += `&q=${encodeURIComponent(searchKeyword)}`
    const { data } = await api(url)
    const sortedExpenses = data.sort((a, b) => {
      return dayjs(b.date).valueOf() - dayjs(a.date).valueOf()
    })
    setExpenses(sortedExpenses)
  }

  const searchExpenses = async () => {
    fetchExpenses()
  }

  const handleDateChange = (selectedDate: Dayjs | null) => {
    setDate(selectedDate?.format('YYYY-MM-DD') ?? null)
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
    const newExpense: ExpenseRequestBody = {
      userId: userinfo.userId,
      amount: parseInt(amount),
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

      if (response.ok) {
        setDate(null)
        setCategory('')
        setAmount('')
        fetchExpenses()
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
      if (response.ok) {
        fetchExpenses()
        closeModal()
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
      if (response.ok) {
        fetchExpenses()
        closeDeleteModal()
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
      amount: parseInt(amount),
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
      <RootLayout>
        <div className="h-screen max-w-[1200px] w-full m-auto p-8">
          <div>
            <form className="flex items-center p-5 border bg-forsythia rounded-full">
              <DatePicker onChange={handleDateChange} value={date ? dayjs(date) : null} />
              <Input className="w-48" value={category} onChange={handleCategoryChange} placeholder="분류" />
              <Input className="w-48" type="number" value={amount} onChange={handleAmountChange} placeholder="금액" />
              <div>
                <Button className="bg-white boder border-gray" onClick={addExpense}>
                  추가
                </Button>
              </div>
              <div className="flex grow"></div>
              <div>
                <Input
                  className="w-48"
                  value={searchKeyword}
                  onChange={handleSearchKeywordChange}
                  placeholder="검색어"
                />
                <Button className="bg-white boder border-gray" onClick={searchExpenses}>
                  검색
                </Button>
              </div>
            </form>
          </div>

          <br />
          <h2>지출 내역 리스트</h2>
          <br />
          <ul>
            {expenses.map((expense) => (
              <Card key={expense.id}>
                <div className="flex gap-2 items-center">
                  날짜 :<div>{expense.date}</div> | 분류 :<div>{expense.category}</div> | 금액 :
                  <div>{expense.amount}</div>
                  <div className="flex grow"></div>
                  <Button onClick={() => openModal(expense)}>수정</Button>
                  <Button onClick={() => openDeleteModal(expense)}>삭제</Button>
                </div>
              </Card>
            ))}
          </ul>

          <Modal
            title="소비 기록 수정"
            open={isModalVisible}
            onCancel={closeModal}
            onOk={handleUpdateExpense}
            destroyOnClose
            okButtonProps={{ style: { background: '#1890ff', borderColor: '#1890ff' } }}
          >
            {selectedExpense && (
              <div className="flex">
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
            okButtonProps={{ style: { background: '#1890ff', borderColor: '#1890ff' } }}
          >
            <p>정말 삭제하시겠습니까?</p>
          </Modal>
        </div>
      </RootLayout>
    </div>
  )
}
