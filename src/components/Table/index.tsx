import React, {useRef} from 'react'
import { agGridAdapter } from '@consta/ag-grid-adapter/agGridAdapter'
import { AgGridReact } from 'ag-grid-react'
import moment from 'moment'
import data from '../../store/02.json'
import useStore, {StoreType} from '../../store'

const defaultColDef = {
  flex: 1,
  minWidth: 50,
  sortable: true,
  filter: true,
  resizable: true,
}

const columnDefs1 = data.Partitions.map((item) => ({field: item.Id.toString(), headerName: item.Name, suppressStickyLabel: true,
  openByDefault: true,   flex: 1,
  minWidth: 50,
  sortable: true,
  filter: true,
  resizable: true, children: [
    item.PlanItems && {field: 'plan0', headerName: 'график без НГПД', sortable: true, filter: true, children: [{field: `plan0-${item.Id}-0`, filter: true, sortable: true, headerName: '', editable: true}, {field: `plan0-${item.Id}-1`, filter: true, sortable: true, headerName: '', editable: true}]}, 
    item.PlanItems && {field: 'plan1', headerName: 'график без НГПД', sortable: true, filter: true, children: [{field: `plan1-${item.Id}-0`, filter: true, sortable: true, headerName: '', editable: true}, {field: `plan1-${item.Id}-1`, filter: true, sortable: true, headerName: '', editable: true}]}, 
    item.FactItems && {field: 'fact0', headerName: 'факт без НГПД', sortable: true, filter: true, children: [{field: `fact0-${item.Id}-0`, filter: true, sortable: true, headerName: '', editable: true}, {field: `fact0-${item.Id}-1`, filter: true, sortable: true, headerName: '', editable: true}]},
    item.FactItems && {field: 'fact1', headerName: 'факт без НГПД', sortable: true, filter: true, children: [{field: `fact1-${item.Id}-0`, filter: true, sortable: true,  headerName: '', editable: true}, {field: `fact1-${item.Id}-1`, filter: true, sortable: true, headerName: '', editable: true}]},
    {field: `sumPlan-${item.Id}`,   flex: 1,
      minWidth: 50,
      sortable: true,
      filter: true,
      resizable: true, editable: true, headerName: 'итого гр.'}, {field: `sumFact-${item.Id}`,   flex: 1,
      minWidth: 50,
      sortable: true,
      filter: true,
      resizable: true, headerName: 'итого фк.', editable: true},
  ]}))

const columnDefs: Array<object> = [{field: 'day', headerName: '', pinned: 'left', width: 20}, ...columnDefs1]

const Table: React.FC = () => {
  const gridRef = useRef()
  
  const days = moment(useStore((state : StoreType) => state.month)).daysInMonth()
  const rowData = [...Array(days)].map((_, i) => {return { day: i+1 }})

  // const columnDefs1 = data.Partitions.

  
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
