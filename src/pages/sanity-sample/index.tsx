import api from '@/clientAPI'
import type { ExpenseResponse } from '@/transections/getAllExpenses'
import { useSession } from 'next-auth/react'
import { useState } from 'react'

export default function Test() {
  const [allUserExpenses, setAllUserExpenses] = useState([])
  const { data: session } = useSession()

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
      userId: session?.user?.email,
      category: data[0],
      amount: data[1],
      date: data[2]
    }
  }

  async function getAllExpensesByCategory(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const searchQuery = (e.target as HTMLFormElement).querySelector('input')!.value
    const { data } = await api(`/api/expenses/search?q=${searchQuery}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    setAllUserExpenses(data)
  }

  return (
    <main className="pr-12 pl-12">
      <h1>Sanity Test Page</h1>
      <section className="flex items-center justify-center flex-col">
        <h2 className="mb-5">{`logged in User name : ${session?.user?.name}`}</h2>
        <h2 className="mb-5">{`logged in User email : ${session?.user?.email}`}</h2>
        {/*  eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${session?.user?.image}`} alt="user image" className="w-full max-w-[60px] rounded-[30px]" />
      </section>
      <section className="mt-12">
        <h3>Add Expense form</h3>
        <form onSubmit={addExpense}>
          {/* selector로 카테고리 목록을 제공해주거나 추가할 수 있어야 합니다. */}
          <input type="text" placeholder="enter a category" />
          <input type="text" placeholder="enter a amount" />
          <input type="date" />
          <input className="pl-5 cursor-pointer" type="submit" value="Add Expense" />
        </form>
      </section>
      <section className="mt-12">
        <h3>get expenses by search query</h3>
        <p>
          <strong>모든 유저의 비용 중 search query와 일치하는 경우</strong>를 가져옵니다.
        </p>
        <form onSubmit={getAllExpensesByCategory}>
          <input type="text" placeholder="enter a search query" />
          <input className="pl-5 cursor-pointer" type="submit" value="search" />
        </form>
        <ul>
          {allUserExpenses &&
            allUserExpenses.map((expense: ExpenseResponse) => {
              return (
                <li key={expense.id}>
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
