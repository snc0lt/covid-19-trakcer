import React, { useState, useEffect } from 'react'
import { Line } from "react-chartjs-2";
import Axios from 'axios';
import numeral from 'numeral'

const options = {
  legend: {
    display: false
  },
  elements: {
    point: {
      radius: 0
    }
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: 'index',
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0,0")
      }
    }
  },
  scales: {
    xAxes: [{
      type: 'time',
      time: {
        format: 'MM/DD/YY',
        tooltipFormat: 'll'
      }
    }],
    yAxes: [{
      gridLines: {
        display: false
      },
      ticks: {
        callback: function (value, index, values) {
          return numeral(value).format('0a')
        }
      }
    }]
  }
}

const buildChartData = (data, casesType) => {
  const chartData = []
  let lastDataPoint

  for (let date in data.cases) {
    if (lastDataPoint) {
      const newDatePoint = {
        x: date,
        y: data[casesType][date] - lastDataPoint
      }
      chartData.push(newDatePoint)
    }
    lastDataPoint = data[casesType][date]
  }
  return chartData
}
function Graph({ casesType = 'cases', ...props }) {

  const [data, setData] = useState({})

  useEffect(() => {
    const getData = async () => {
      const { data } = await Axios.get('https://disease.sh/v3/covid-19/historical/all?lastdays=120')
      // console.log(data)
      const chartData = buildChartData(data, casesType)
      setData(chartData)
    }

    getData()
  }, [casesType])

  return (
    <div className={props.className}>
      {
        data?.length > 0 && (
          <Line
            options={options}
            data={{
              datasets: [{
                data: data,
                backgroundColor: 'rgba(50, 208, 195, 1)',
                borderColor: '#40b6ff'
              }]
            }}
          >
          </Line>
        )
      }
    </div>
  )
}

export default Graph
