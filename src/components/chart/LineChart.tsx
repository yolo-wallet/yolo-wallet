import React from 'react'
import { Line } from 'react-chartjs-2'
import { CategoryScale } from 'chart.js'
import Chart from 'chart.js/auto'

const LineChart = ({ chartData }: any) => {
  Chart.register(CategoryScale)

  return <Line data={chartData} />
}

export default LineChart
