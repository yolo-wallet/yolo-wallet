// import { getServerSession } from 'next-auth'
// import { getProviders } from 'next-auth/react'
// import { redirect } from 'next/navigation'

import { getSession, useSession } from 'next-auth/react'

// type Props = {
//   searchParams: {
//     callbackUrl: string
//   }
// }

export default function Test() {
  const { data: session } = useSession()

  function addExpense(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // * form에서 데이터를 가져오는 얘시입니다. 로직은 대충 짰으니까 신경쓰지마세요!
    console.log('add expense')
    const data = Array.from(
      (e.target as HTMLFormElement).querySelectorAll('input')
    )
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
      date: data[2],
    }

    console.log('expenseForm : ', expenseForm)
  }

  return (
    <section>
      <h1>Sanity Test Page</h1>
      <div className='flex items-center justify-center flex-col'>
        <h2>{`logged in User name : ${session?.user?.name}`}</h2>
        <h2>{`logged in User email : ${session?.user?.email}`}</h2>
        {/*  eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${session?.user?.image}`}
          alt='user image'
          className='w-full max-w-[60px] rounded-[30px]'
        />
      </div>
      <div>
        <h3>Add Expense form</h3>
        <form onSubmit={addExpense}>
          {/* selector로 카테고리 목록을 제공해주거나 추가할 수 있어야 합니다. */}
          <input type='text' placeholder='enter a category' />
          <input type='text' placeholder='enter a amount' />
          <input type='date' />
          <input
            className='pl-5 cursor-pointer'
            type='submit'
            value='Add Expense'
          />
        </form>
      </div>
    </section>
  )
}
