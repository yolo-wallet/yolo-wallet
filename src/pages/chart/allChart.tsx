import useUserInfo from '@/hooks/useUserInfo'
import { chartStore } from '@/store/chartStore'
import { ExpenseSummary } from '@/types/api'
import React, { useEffect } from 'react'

import BarChart from '@/components/chart/BarChart'
import LineChart from '@/components/chart/LineChart'
import DoughnutChart from '@/components/chart/DoughnutChart'

const chart = () => {
  // 구현할 기능 목록
  // 이번 달 카테고리 별 지출 금액 원형그래프
  // 이번 달 전체 소비 추이 직선그래프
  // 이번 달 카테고리 별 소비 추이 막대그래프

  // 전체 지출 카테고리 그래프
  // 년도별 월별 지출 그래프

  const {
    getCategories,
    getExpenses,
    getCalendar,
    getCategorieData,
    daily,
    topCategorieData,
    categoriesData,
    undefinedCategorieData
  } = chartStore()

  const [userInfo] = useUserInfo()
  const userId = userInfo.userId

  const year = 2023
  const month = 7
  const date = year.toString() + '-' + (month > 9 ? month.toString() : '0' + month.toString())

  useEffect(() => {
    getCategories(userId)
    getExpenses('daily', userId)
    getCalendar(year, month, userId)
  }, [userInfo])

  useEffect(() => {
    if (categoriesData.length > 0) {
      getCategorieData(categoriesData[0].categorie, userId)
      getCategorieData('undefined', userId)
    }
  }, [categoriesData])

  const oneMonthDaily = daily.filter((day) => {
    return day._id.slice(0, 7) === date
  })

  oneMonthDaily.sort((a: ExpenseSummary, b: ExpenseSummary): number => {
    if (a._id < b._id) {
      return -1
    } else if (a._id > b._id) {
      return 1
    } else {
      return 0
    }
  })

  const chartData = {
    labels: oneMonthDaily.map((data) => data._id),
    datasets: [
      {
        label: `${month}월 일별 지출금액 추이`,
        data: oneMonthDaily.map((data) => data.totalAmount),
        backgroundColor: ['rgba(238, 102, 121, 1)', 'rgba(98, 181, 229, 1)', 'rgba(255, 198, 0, 1)']
      }
    ]
  }

  const options = {
    plugins: {
      legend: {
        display: false
      }
    }
  }

  const options2 = {
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true
        }
      },
      y: {
        display: true,

        suggestedMin: 0
      }
    }
  }

  const chartData2 = {
    labels: categoriesData.map((data) => data.categorie),
    datasets: [
      {
        label: `${month}월 일별 지출금액`,
        data: categoriesData.map((data) => data.totalAmount),
        backgroundColor: ['rgba(238, 102, 121, 1)', 'rgba(98, 181, 229, 1)', 'rgba(255, 198, 0, 1)'],

        borderWidth: 5,
        cutout: '70%',
        borderRadius: 2,
        hoverBorderWidth: 0
      }
    ]
  }

  const topCategor = topCategorieData.filter((data) => {
    return data.date.slice(0, 7) === date
  })

  let categori = ''
  if (topCategor.length > 0) {
    categori = topCategor[0].category
  }
  const chartData3 = {
    labels: topCategor.map((data) => data.date),
    datasets: [
      {
        label: `${month}월 최대 지출 카테고리(${categori}) 지출금액`,
        data: topCategor.map((data) => data.amount),
        backgroundColor: ['rgba(238, 102, 121, 1)', 'rgba(98, 181, 229, 1)', 'rgba(255, 198, 0, 1)'],

        borderWidth: 2
      }
    ]
  }

  const undefinedCategorie = undefinedCategorieData.filter((data) => {
    return data.date.slice(0, 7) === date
  })

  const chartData4 = {
    labels: undefinedCategorie.map((data) => data.date),
    datasets: [
      {
        label: `${month}월 미분류 카테고리 지출금액`,
        data: undefinedCategorie.map((data) => data.amount),
        backgroundColor: ['rgba(238, 102, 121, 1)', 'rgba(98, 181, 229, 1)', 'rgba(255, 198, 0, 1)'],

        maxBarThickness: 10
      }
    ]
  }

  const undefinedData = categoriesData.filter((data) => data.categorie === 'undefined')

  const noUndefinedData = categoriesData.filter((data) => data.categorie !== 'undefined')
  let sum = 0
  for (let i = 0; i < noUndefinedData.length; i++) {
    sum = sum + noUndefinedData[i].totalAmount
  }

  const noCategorieData = [...undefinedData, { categorie: 'total', totalAmount: sum }]
  console.log(noCategorieData)
  const chartData5 = {
    labels: noCategorieData.map((data) => data.categorie),
    datasets: [
      {
        label: `${month}월 미분류 소비 비율`,
        data: noCategorieData.map((data) => data.totalAmount),
        backgroundColor: ['rgba(238, 102, 121, 1)', 'rgba(98, 181, 229, 1)', 'rgba(255, 198, 0, 1)'],

        borderWidth: 5,
        cutout: '70%',
        borderRadius: 2,
        hoverBorderWidth: 0
      }
    ]
  }

  const chartBoxStyle = 'bg-white drop-shadow-lg w-full p-8 mb-8'

  return (
    <div className="container mx-auto bg-slate-100 ">
      <div className=" max-w-[764px] mx-auto py-8">
        <div className={chartBoxStyle}>
          <p className="mb-5 text-lg font-bold">이번 달 지출 카테고리</p>
          <div className="flex items-center justify-around flex-wrap">
            <div>
              <DoughnutChart chartData={chartData2} options={options} />
            </div>
            <div>
              <ul>
                {categoriesData.map((data) => {
                  return (
                    <li
                      key={data.categorie}
                      className="border-b border-gray-300 p-2 flex justify-between
                       min-w-[300px]"
                    >
                      <p>{data.categorie}</p>
                      <p>{data.totalAmount}</p>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </div>

        <div className={chartBoxStyle}>
          <p className="mb-5 text-lg font-bold">이번 달 일일 지출</p>
          <BarChart chartData={chartData} options={options} />
          <br />
          <LineChart chartData={chartData} options={options2} />
        </div>

        <div className={chartBoxStyle}>
          <p className="mb-5 text-lg font-bold">이번 달 TOP1 소비 카테고리</p>
          <LineChart chartData={chartData3} options={options2} />
        </div>
        <div className={chartBoxStyle}>
          <p className="mb-5 text-lg font-bold">이번 달 미분류 소비 비율</p>
          <div className="flex items-center justify-around w-full flex-wrap">
            <div>
              <DoughnutChart chartData={chartData5} options={options} />
            </div>
            <div>
              <BarChart chartData={chartData4} options={options2} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default chart
