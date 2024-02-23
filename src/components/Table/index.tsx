import React, {useEffect, useRef, useState} from 'react'
import { agGridAdapter } from '@consta/ag-grid-adapter/agGridAdapter'
import { AgGridReact } from 'ag-grid-react'
import moment from 'moment'
import data from '../../store/02.json'
import useStore, {StoreType} from '../../store'


const defaultColDef = {
  flex: 1,
  minWidth: 60,
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
  cellStyle: { whiteSpace: 'pre' },
}

const columnDefs: Array<object> = [{field: 'day', headerName: '', pinned: 'left', fontSize: 8, width: 80,
  editable: false, cellStyle: { backgroundColor: '#ecf1f4', borderRight: '2px solid #ccd9e0'  } }, 
...data.Partitions.map((item) => {
 
  const children = []
  const colors = {
    'LightBlue': {left:'rgb(223, 237, 246)', right: 'rgb(223, 237, 246)'},
    'LightGreen': {left: 'rgb(207, 248, 228)', right: 'rgb(207, 248, 228)'},
    'LightGreenRed': {left: 'rgb(207, 248, 228)', right: 'rgb(248, 215, 207)'}
  }
  
  item.PlanItems.length > 0 && children.push({field: 'plan0', headerName: 'график', headerTooltip: 'график',
    children: [
      {field: `plan0-${item.Id}-0`, headerName: ''}, 
      {field: `plan0-${item.Id}-1`, headerName: ''}
    ]
  })
  item.FactItems.length > 0 && children.push({field: 'fact0', headerName: 'факт',
    children: [
      {field: `fact0-${item.Id}-0`, headerName: ''}, 
      {field: `fact0-${item.Id}-1`, headerName: ''}
    ]
  })
  return ({field: item.Id.toString(), headerName: item.Name, minWidth: 80, borderRight: '2px solid #ccd9e0',
    children: [...children,
      {field: `sumPlan-${item.Id}`, headerName: 'итого\nплан',
        children: [
          {field: `sumPlanChild-${item.Id}-0`, headerName: '', cellStyle: { backgroundColor: item.Color ? colors[item.Color].left : '#fff'}}
        ]
      }, 
      {field: `sumFact-${item.Id}`, headerName: 'итого\nфакт', 
        children: [
          {field: `sumFactChild-${item.Id}-0`, headerName: '', cellStyle: { backgroundColor: item.Color ? colors[item.Color].right : '#fff', borderRight: '2px solid #ccd9e0' }}
        ]},
    ]})
})]

const Table: React.FC = () => {
  const gridRef = useRef(null)
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
      const obj: {id: number, day: string} = { id: day,  day: (day+1).toString() } 
      data.Partitions.map((field) => {
        if(field.DailySum[day] && (field.DailySum[day][0] || field.DailySum[day][1])) 
          obj[`sumPlanChild-${field.Id}-0`] = (field.DailySum[day][0] ?? '') + '\n' + (field.DailySum[day][1] ?? '')
        if(field.DailySum[day] && (field.DailySum[day][2] || field.DailySum[day][3]))
          obj[`sumFactChild-${field.Id}-0`] = (field.DailySum[day][2] ?? '' )+ '\n' + (field.DailySum[day][3] ?? '')
      })
      return obj
    })
    temp.push({id: temp.length, day: 'ИТОГО:\nмер-тий'},{id: temp.length+1, day: 'Сум. прир.\nдеб. тн/сут.'},{id: temp.length+2, day: 'Накоп.\nдобыча, тн.'})
    setRowData(temp)
  },[])

  useEffect(()=>{
    setTimeout(() => {
      data.Partitions.map((itemCol) => {
        itemCol.PlanItems.map((itemRow) => {
          const rowNode = gridRef.current!.api.getRowNode(moment(itemRow?.Day).subtract(1, 'days').format('D'))!
          itemRow?.Name &&rowNode.setDataValue(`plan0-${itemCol.Id}-0`, itemRow?.Name.replace(/ /g, '\n') + '\n' + itemRow?.OilRate)
        })
        itemCol.FactItems.map((itemRow) => {
          const rowNode = gridRef.current!.api.getRowNode(moment(itemRow?.Day).subtract(1, 'days').format('D'))!
          itemRow?.Name && rowNode.setDataValue(`fact0-${itemCol.Id}-0`, itemRow?.Name.replace(/ /g, '\n') + '\n' + itemRow?.OilRate)
        })
      })
    }, 500)
  })

  return (
    <div className="ag-theme-quartz" style={{ height: '100%', width: '100%' }}>
      <AgGridReact
        ref={gridRef}
        {...styleOptions}
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        headerHeight={1}
        rowClassRules={{
          'border-top': (params) => params.data?.day === 'ИТОГО:\nмер-тий',
        }}
        enableCellChangeFlash={true}
        rowHeight={42}
      />
    </div>
  )
}

export default Table
