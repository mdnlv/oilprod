import React, {useEffect} from 'react'
import { Line } from '@consta/charts/Line'

type Item = { Date: string; scales: number, country: string };

const colorMap: { [key: string]: string } = {
  'Austria': '#ff7514',
  'Canada': '#ad4800',
  'France': '#ca3a27',
  'Germany': '#470d0b',
  'Japan': '#ffc0cb',
  'Netherlands': '#ffd88a',
  'New Zealand': '#b39929',
  'Spain': '#c5e384',
  'Sweden': '#8c4566',
  'Switzerland': '#924e7d',
  'United Kingdom': '#905d5d',
  'United States': '#a2a2d0',
}

const data: Item[] =  [
  {
    Date: '2010-01',
    scales: 1998,
    country: 'Canada'
  },
  {
    Date: '2010-02',
    scales: 1850,
    country: 'Switzerland'
  },
  {
    Date: '2009-01',
    scales: 1898,
    country: 'Canada'
  },
  {
    Date: '2009-02',
    scales: 1750,
    country: 'Switzerland'
  },
]


const Charts: React.FC = () => {
  useEffect(()=>{

  }, [])

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <Line
        data={data}
        xField="Date"
        yField="scales"
        seriesField="country"
        slider={{
          start: 0.1,
          end: 0.5,
        }}
        meta={{
          Date: {alias: 'Дата'},
          scales : {alias: 'Число'},
        }}
        lineStyle={({ country }) => ({stroke: colorMap[country]})}
      />
    </div>
  )
}

export default Charts
