import React, {useEffect, useRef, useState} from 'react'
import { agGridAdapter } from '@consta/ag-grid-adapter/agGridAdapter'
import { AgGridReact } from 'ag-grid-react'
import moment from 'moment'
import data from '../../store/02.json'
import useStore, {StoreType} from '../../store'

const defaultColDef = {
  flex: 1,
  minWidth: 40,
  resizable: true,
  suppressMovable: true,
  fontSize: 8,
  editable: true,
  tooltipShowDelay: 10,
  headerComponentParams: {
    transform: 'uppercase',
    view: 'brand',
    align: 'right',
  },
  cellStyle: { whiteSpace: 'pre' }
}

const columnDefs: Array<object> = [{field: 'day', headerName: '', pinned: 'left', fontSize: 8, width: 80,
  editable: false, cellStyle: { backgroundColor: '#ecf1f4', borderRight: '2px solid #ccd9e0'  } }, 
...data.Partitions.map((item) => ({field: item.Id.toString(), headerName: item.Name, minWidth: 80,
  children: [
    item.PlanItems && {field: 'plan0', headerName: 'график без НГПД', headerTooltip: 'график без НГПД', 
      children: [
        {field: `plan0-${item.Id}-0`, headerName: ''}, 
        {field: `plan0-${item.Id}-1`, headerName: ''}
      ],
      headerComponent: (displayName) => <><span>{displayName}</span><button>+</button></>
    }, 
    item.PlanItems && {field: 'plan1', headerName: 'график без НГПД',
      children: [
        {field: `plan1-${item.Id}-0`, headerName: ''}, 
        {field: `plan1-${item.Id}-1`, headerName: ''}
      ]}, 
    item.FactItems && {field: 'fact0', headerName: 'факт без НГПД',
      children: [
        {field: `fact0-${item.Id}-0`, headerName: ''}, 
        {field: `fact0-${item.Id}-1`, headerName: ''}
      ]},
    item.FactItems && {field: 'fact1', headerName: 'факт без НГПД',
      children: [
        {field: `fact1-${item.Id}-0`, headerName: ''}, 
        {field: `fact1-${item.Id}-1`, headerName: ''}
      ]},
    {field: `sumPlan-${item.Id}`, minWidth: 90, headerName: 'итого план', children: [
      {field: `sumPlanChild-${item.Id}-0`, headerName: '', cellStyle: { backgroundColor: '#dbe4ea' }}
    ]}, 
    {field: `sumFact-${item.Id}`, minWidth: 90, headerName: 'итого факт', children: [
      {field: `sumFactChild-${item.Id}-0`, headerName: '', cellStyle: { backgroundColor: '#dbe4ea', borderRight: '2px solid #ccd9e0' }}
    ]},
  ]}))]

const Table: React.FC = () => {
  const gridRef = useRef()
  const days = moment(useStore((state : StoreType) => state.month)).daysInMonth()
  const [rowData, setRowData] = useState([])

  const styleOptions = agGridAdapter({
    size: 's',
    borderBetweenColumns: true,
    borderBetweenRows: true,
    headerView: 'clear',
  })

  useEffect(()=>{
    const temp = [...Array(days)].map((_, day) => {
      const obj: {day: string} = { day: (day+1).toString() } 
      data.Partitions.map((field) => {
        if(field.DailySum[day][0] || field.DailySum[day][1]) 
          obj[`sumPlanChild-${field.Id}-0`] = field.DailySum[day][0] + ' / ' + field.DailySum[day][1]
        if(field.DailySum[day][2] || field.DailySum[day][3]) 
          obj[`sumFactChild-${field.Id}-0`] = field.DailySum[day][2] + ' / ' + field.DailySum[day][3]
      })
      return obj
    })
    temp.push({day: 'ИТОГО:\nмер-тий'},{day: 'Сум. прир.\nдеб. тн/сут.'},{day: 'Накоп.\nдобыча, тн.'})
    setRowData(temp)

    console.log(data.Partitions.map(item => ({id: item.Id, name: item.Name})))
  },[])

  const rowClassRules = {
    'border-top': function(params) { return params.data?.day === 'ИТОГО:\nмер-тий' },
  }

  return (
    <div className="ag-theme-quartz" style={{ height: '100%', width: '100%' }}>
      <AgGridReact
        ref={gridRef}
        {...styleOptions}
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        headerHeight={1}
        rowClassRules={rowClassRules}
      />
    </div>
  )
}

export default Table
