import React from 'react'
import { Line } from '@consta/charts/Line'
import useDataStore, { DataStoreType } from '../../store/data'

type Item = { date: number; value: number, kind: string };

const colorMap: { [key: string]: string } = {
  'Итого добыча': '#ad4800',
  'Потенциал простоя': '#924e7d',
}

const Charts: React.FC = () => {
  const getChart = useDataStore((state : DataStoreType) => state.PlanItems)[40]
  const data: Item[] = []
  
  console.log(getChart)
  for(const day in getChart) {
    data.push({
      date: Number(day),
      value: getChart[day][0]['Эффект'], 
      kind: 'Потенциал простоя' 
    })

  }

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <Line
        data={data}
        xField="date"
        yField="value"
        seriesField="kind"
        slider={{
          start: 0.1,
          end: 0.5,
        }}
        meta={{
          date: {alias: 'Дата'},
          value : {alias: 'Число'},
        }}
        lineStyle={({ kind }) => ({stroke: colorMap[kind]})}
      />
    </div>
  )
}

export default Charts
