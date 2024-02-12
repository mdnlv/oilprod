import React, {useRef} from 'react'
import { agGridAdapter } from '@consta/ag-grid-adapter/agGridAdapter'
import { AgGridReact } from 'ag-grid-react'
import moment from 'moment'
import data from '../../store/02.json'



const defaultColDef = {
  flex: 1,
  minWidth: 50,
  //enableValue: true,
  //  /enableRowGroup: true,
  // enablePivot: true,
  //sortable: true,
  // filter: true,
  resizable: true,
}

/*const rowData: Array<object>  = [
  { user: 'Крокодил Гена', role: 'администратор', priority: '1' },
  { user: 'Чебурашка', role: 'читатель', priority: '2' },
  { user: 'Шапокляк', role: 'вредитель', priority: '777' },
]

const columnDefs: Array<object> = [
  { field: 'user', headerName: 'Пользователь' },
  { field: 'role', headerName: 'Роль' },
  { field: 'priority', headerName: 'Приоритет' },
]*/

const days = moment().daysInMonth()

const columnDefs1 = data.Partitions.map((item) => ({field: item.Id.toString(), headerName: item.Name, suppressStickyLabel: true,
  openByDefault: true, children: [
    item.PlanItems && {field: 'plan0', headerName: 'график без НГПД', children: [{field: 'plan0-0', headerName: '', editable: true}, {field: 'plan0-0', headerName: '', editable: true}]}, 
    item.PlanItems && {field: 'plan1', headerName: 'график без НГПД', children: [{field: 'plan0-0', headerName: '', editable: true}, {field: 'plan0-0', headerName: '', editable: true}]}, 
    item.FactItems && {field: 'fact0', headerName: 'факт без НГПД', children: [{field: 'plan0-0', headerName: '', editable: true}, {field: 'plan0-0', headerName: '', editable: true}]},
    item.FactItems && {field: 'fact1', headerName: 'факт без НГПД', children: [{field: 'plan0-0', headerName: '', editable: true}, {field: 'plan0-0', headerName: '', editable: true}]},
    {field: 'sumPlan', headerName: 'итого гр.'}, {field: 'sumFact', headerName: 'итого фк.'},
  ]}))

const columnDefs: Array<object> = [{field: 'day', headerName: '', pinned: 'left', width: 20}, ...columnDefs1]

const Table: React.FC = () => {
  const rowData = [...Array(days)].map((_, i) => {return { day: i+1, user: 'Чебурашка', role: 'читатель', priority: i }})
  const gridRef = useRef()
  const styleOptions = agGridAdapter({
    size: 'm',
    borderBetweenColumns: true,
    borderBetweenRows: true,
    headerVerticalAlign: 'center',
    headerView: 'default',
    verticalAlign: 'center',
  })
  return (
    <div className="ag-theme-quartz" style={{ height: '100%', width: '100%' }}>
      <AgGridReact
        ref={gridRef}
        {...styleOptions}
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        headerHeight={0}
      />
    </div>
  )
}

export default Table
