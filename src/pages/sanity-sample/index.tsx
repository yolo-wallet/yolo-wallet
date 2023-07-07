import api from '@/clientAPI'
import useUserInfo from '@/hooks/useUserInfo'
import type { ExpenseResponse } from '@/transections/getAllExpenses'
import { useState } from 'react'

export default function Test() {
  const [allUserExpenses, setAllUserExpenses] = useState([])
  const [category, setCategory] = useState([])
  const [userInfo, isLoading] = useUserInfo()

  // * 1. 소비 기록 작성
  // * POST /api/expenses
  function addExpense(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = Array.from((e.target as HTMLFormElement).querySelectorAll('input'))
      .map((el, i) => {
        switch (i) {
          case 0:
            return el.value
          case 1:
            return Number(el.value)
          case 2:
            return el.value
        }
      })
      .filter((v) => v)
    const expenseForm = {
      userId: userInfo.userId,
      category: data[0],
      amount: data[1],
      date: data[2]
    }
  }
  // * 2. 소비 품목 목록
  async function getCategoryByUserId(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    // e.preventDefault()
    const { data } = await api(`/api/categories?userId=${userInfo.userId}`)
    console.log('getCategoryByUserId DATA : ', data)
    setCategory(data)
  }

  // * 3. 검색어에 해당하는 소비 항목 및 금액 조회 API
  // * /api/expenses/search?q={keyword}&userId={userId}
  async function getAllExpensesByCategory(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const searchQuery = (e.target as HTMLFormElement).querySelector('input')!.value
    const isChecked = ((e.target as HTMLFormElement).querySelector('input[type=checkbox]') as HTMLInputElement).checked
    let path = '/api/expenses/search?'
    if (searchQuery) path += `q=${searchQuery}&`
    if (isChecked) path += `userId=${userInfo.userId}&`

    const { data } = await api(path, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    setAllUserExpenses(data)
  }

  if (isLoading) return <div>loading...</div>

  return (
    <main className="pr-12 pl-12">
      <h1>Sanity Test Page</h1>
      <section className="flex items-center justify-center flex-col">
        <h2 className="mb-5">{`logged in User name : ${userInfo.name}`}</h2>
        <h2 className="mb-5">{`logged in User email : ${userInfo.email}`}</h2>
        {/*  eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${userInfo.image}`} alt="user image" className="w-full max-w-[60px] rounded-[30px]" />
      </section>
      <section className="mt-12">
        <h3>지출 추가하기</h3>
        <form onSubmit={addExpense}>
          {/* selector로 카테고리 목록을 제공해주거나 추가할 수 있어야 합니다. */}
          <input type="text" placeholder="enter a category" />
          <input type="text" placeholder="enter a amount" />
          <input type="date" />
          <input className="pl-5 cursor-pointer" type="submit" value="Add Expense" />
        </form>
      </section>
      <section className="mt-12">
        <h3>소비 품목 목록</h3>
        <button type="button" onClick={getCategoryByUserId}>
          클릭시 사용자의 모든 카테고리를 출력합니다.
        </button>
        <ul>
          {category &&
            category.map((cate: string) => {
              return <li key={cate}>{cate}</li>
            })}
        </ul>
      </section>
      <section className="mt-12">
        <h3>검색 쿼리로 모든 지출 가져오기</h3>
        <form onSubmit={getAllExpensesByCategory}>
          <input type="text" placeholder="enter a search query" />
          <input type="checkbox" />
          <input className="pl-5 cursor-pointer" type="submit" value="search" />
        </form>
        <ul>
          {allUserExpenses &&
            allUserExpenses.map((expense: ExpenseResponse) => {
              return (
                <li key={expense.id}>
                  <span>{`userId : ${expense.userId} & `}</span>
                  <span>{`cateogry : ${expense.category} & `}</span>
                  <span>{`${expense.amount} 원 &`}</span>
                  <span>{` Date : ${expense.date} `}</span>
                </li>
              )
            })}
        </ul>
      </section>
    </main>
  )
}
