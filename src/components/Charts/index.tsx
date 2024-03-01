import React, {useEffect} from 'react'
import { Line } from '@consta/charts/Line'

type Item = { Date: string; scales: number, country: string };

const colorMap: { [key: string]: string } = {
  'Итого добыча': '#ad4800',
  'Потенциал простоя': '#924e7d',
}

const data: Item[] =  [
  {
    Date: '2010-01',
    scales: 19998,
    country: 'Итого добыча'
  },
  {
    Date: '2011-02',
    scales: 18560,
    country: 'Потенциал простоя'
  },
  {
    Date: '2009-01',
    scales: 21898,
    country: 'Итого добыча'
  },
  {
    Date: '2009-02',
    scales: 21750,
    country: 'Потенциал простоя'
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
