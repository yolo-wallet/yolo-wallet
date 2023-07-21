import React, { useEffect } from 'react'
import { Alert, Calendar } from 'antd'
import type { Dayjs } from 'dayjs'
import { useCalendarStore } from '@/store/calenderStore'
import useUserInfo from '@/hooks/useUserInfo'

const CalendarPage: React.FC = () => {
  const {
    daily,
    getCategories,
    getExpenses,
    getCategorieData,
    categoriesData
  } = useCalendarStore()

  const [userInfo] = useUserInfo()
  const userId = userInfo.userId

  const [value, setValue] = React.useState<Dayjs | undefined>()
  const [selectedValue, setSelectedValue] = React.useState<Dayjs | undefined>()

  const onSelect = (newValue: Dayjs) => {
    setValue(newValue)
    setSelectedValue(newValue)
  }

  const onPanelChange = (newValue: Dayjs) => {
    setValue(newValue)
  }

  const dateCellRender = (current: Dayjs) => {
    const formattedDate = current.format('YYYY-MM-DD')
    const events = daily.filter((expense) => expense.date === formattedDate)
    return (
      <ul className="events">
        {events.map((expense) => (
          <li key={expense.id}>
            {expense.category}: {expense.amount}원
          </li>
        ))}
      </ul>
    )
  }

  const monthCellRender = (current: Dayjs) => {
    const formattedMonth = current.format('YYYY-MM')
    const totalAmount = categoriesData.find((data) => data.categorie === formattedMonth)?.totalAmount
    return (
      <div className="notes-month">
        <section>{totalAmount}</section>
        <span>Total Amount</span>
      </div>
    )
  }

  useEffect(() => {
    getCategories(userId)
    getExpenses('daily', userId)
    getExpenses('weekly', userId)
    getExpenses('monthly', userId)
  }, [userId, getCategories, getExpenses])

  useEffect(() => {
    if (categoriesData.length > 0) {
      getCategorieData(categoriesData[0].categorie, userId)
      getCategorieData('undefined', userId)
    }
  }, [categoriesData, getCategorieData])

  return (
    <>
      {selectedValue && (
        <Alert message={`You selected date: ${selectedValue.format('YYYY-MM-DD')}`} />
      )}
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <Calendar
          value={value}
          dateCellRender={dateCellRender}
          monthCellRender={monthCellRender}
          onPanelChange={onPanelChange}
          onSelect={onSelect}
        />
      </div>
    </>
  )
}

export default CalendarPage
