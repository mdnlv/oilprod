/* eslint-disable react/display-name */
import React, { memo, useEffect, useRef, useState} from 'react'
import { agGridAdapter } from '@consta/ag-grid-adapter/agGridAdapter'
import { AgGridReact } from 'ag-grid-react'
import moment from 'moment'
import data from '../../store/test.json'
import useStore, {StoreType} from '../../store'

// import { Button } from '@consta/uikit/Button'
import { IconCopy } from '@consta/icons/IconCopy'
import { IconOpenInNew } from '@consta/icons/IconOpenInNew'
// import { IconClose } from '@consta/icons/IconClose'
import { Text } from '@consta/uikit/Text'
import useDataStore, { DataStoreType } from '../../store/data'
import { Button } from '@consta/uikit/Button'

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cellRenderer = (params: any) => {
  //const mood = useMemo(() => imageForMood(props.value), [props.value])
  return <div style={{display: 'flex', flexDirection: 'column'}}>{params.value}</div>
}

const Table: React.FC = () => {
  const gridRef = useRef(null)
  const days = moment(useStore((state : StoreType) => state.month)).daysInMonth()
  const [rowData, setRowData] = useState([])
  const [columnDefs, setColumnDefs] = useState([])
  // const sumPlan1 = useDataStore((state : DataStoreType) => state.DailySumPlan)
  //const setDailySum1 = useDataStore((state : DataStoreType) => state.setDailySum)
  const factItems1 = useDataStore((state : DataStoreType) => state.FactItems)
  const cellUpdate = useDataStore((state : DataStoreType) => state.cellUpdate)

  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cellEditor = memo((params: any) => {
    const [input1, setInput1] = useState('')
    const [input2, setInput2] = useState('')
    const refContainer = useRef<HTMLDivElement>(null)
    const values = params.value?.split(/(\n)/)

    useEffect(() => {
      refContainer.current?.focus()
      if(values) {
        setInput1(values[2] + ' ' + values[0])
        setInput2(values[4])
      }
    }, [])

    return (
      <div
        ref={refContainer}
        style={{
          border: '1px solid grey',
          backgroundColor: '#e6e6e6',
          padding: 15,
          display: 'inline-block',
        }}
        tabIndex={1} // important - without this the key presses wont be caught
      >
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <div style={{
            display: 'flex', 
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 2, 
            alignItems: 'flex-start'
          }}>
            {/*<Text size="xs" view="linkMinor" weight="semibold">ЗБС(т/сут)</Text>*/}
            <Text size="xs" view="linkMinor" style={{marginBottom: 12}}>{params.data.day} февраля</Text>
            {/*<Button size="xs" label="Скопировать" view="clear" iconLeft={IconClose} onlyIcon*/}
          </div>
          <input value={input1} onChange={(e) => {setInput1(e.target.value)}} style={{marginBottom: 4}}/>
          <input value={input2} onChange={(e) => {setInput2(e.target.value)}} style={{marginBottom: 4}}/>
          <div style={{display: 'flex', flexDirection: 'row', justifyContent:'flex-end', marginTop: 4}}>
            {/*<Button size="xs" label="Скопировать" view="clear" iconLeft={IconCopy}/>
          <Button size="xs" label="Переместить" view="clear" iconLeft={IconOpenInNew} />*/}
            <Button size="xs" label="Сохранить" style={{marginLeft: 7}} onClick={() => {
              const colId =  params.colDef.field.slice((params.colDef.field.indexOf('-') + 1), params.colDef.field.lastIndexOf('-'))
              const colIndex =  params.colDef.field.slice(params.colDef.field.lastIndexOf('-') +1)
              const newValues = input1.split(' ')
              cellUpdate({
                day: Number(params.data.day),
                newPlaceName: newValues[1],
                newPlaceNum: newValues[0],
                newWeight: input2,
                colId: Number(colId)+1,
                colIndex: Number(colIndex)
              })
              setTimeout(() => {
                tableUpdate()
                //sumUpdate()
              }, 100)
            }} />
          </div>
        </div>
      </div>
    )
  })


  // Заголовки столбцов
  useEffect(() => {
    const tempColumnDefs: Array<object> = [{field: 'day', headerName: '', pinned: 'left', fontSize: 8, width: 80,
      editable: false, cellStyle: { backgroundColor: '#ecf1f4', borderRight: '3px solid #ccd9e0'  } }, 
    ...data.Partitions.map((item, index) => {
   
      const children = []
      const colors = {
        'LightBlue': {left:'rgb(223, 237, 246)', right: 'rgb(223, 237, 246)'},
        'LightGreen': {left: 'rgb(207, 248, 228)', right: 'rgb(207, 248, 228)'},
        'LightGreenRed': {left: 'rgb(207, 248, 228)', right: 'rgb(248, 215, 207)'}
      }
    
      item.PlanItems.length > 0 && children.push({field: 'plan0', headerName: 'график', headerTooltip: 'график',
        children: [
          {field: `plan0-${item.Id}-0`, headerName: '', cellRenderer: cellRenderer,
            cellEditor: cellEditor,
            cellEditorPopup: true}, 
          {field: `plan0-${item.Id}-1`, headerName: '', cellRenderer: cellRenderer,
            cellEditor: cellEditor,
            cellEditorPopup: true}
        ]
      })

      if(factItems1 && factItems1[item.Id]) {
        let temp = []
        for (const i in factItems1[item.Id]) {
          if(factItems1[item.Id][i].length > temp.length) temp = factItems1[item.Id][i]
        }
    
        factItems1[item.Id] && children.push({field: 'fact0', headerName: 'факт',
          children: [...temp.map((_, i) =>
            ({field: `fact0-${index}-${i}`, headerName: '',
              cellRenderer: cellRenderer,
              cellEditor: cellEditor,
              cellEditorPopup: true
            })),
          {field: `fact0-${index}-${temp.length}`, headerName: '',
            cellRenderer: cellRenderer,
            cellEditor: cellEditor,
            cellEditorPopup: true
          }
          ] 
        })
      } 

      // else {
      //   item.FactItems.length > 0 && children.push({field: 'fact0', headerName: 'факт',
      //     children: [
      //       {field: `fact0-${item.Id}-0`, headerName: ''}, 
      //       {field: `fact0-${item.Id}-1`, headerName: '',
      //         cellRenderer: cellRenderer,
      //         cellEditor: cellEditor,
      //         cellEditorPopup: true}
      //     ]})
      // }
  
      return ({field: item.Id.toString(), headerName: item.Name, minWidth: 80, borderRight: '3px solid #ccd9e0',
        children: [...children,
          {field: `sumPlan-${item.Id}`, headerName: 'итого\nплан',
            children: [
              {field: `sumPlanChild-${item.Id}-0`, headerName: '', cellStyle: { backgroundColor: item.Color ? colors[item.Color].left : '#fff'}}
            ]
          }, 
          {field: `sumFact-${item.Id}`, headerName: 'итого\nфакт', 
            children: [
              {field: `sumFactChild-${item.Id}-0`, headerName: '', cellStyle: { backgroundColor: item.Color ? colors[item.Color].right : '#fff', borderRight: '3px solid #ccd9e0' }}
            ]},
        ]})
    })]
    setColumnDefs(tempColumnDefs)
  }, [factItems1])

  const styleOptions = agGridAdapter({
    size: 's',
    borderBetweenColumns: true,
    borderBetweenRows: true,
    headerView: 'clear',
  })

  // Данные итоговых столбцов


  const sumUpdate = () => {
    const temp = [...Array(days)].map((_, day) => {
      const obj: {id: number, day: string} = { id: day,  day: (day+1).toString() } 
        
      data.Partitions.map((field) => { 
        // // console.log(factItems1)
        // if(sumPlan1[day + 1]) 
        //   obj[`sumPlanChild-${field.Id}-0`] = sumPlan1[day+1].length + '\n' + sumPlan1[day +1].reduce((p,c) => p+c.OilRate, 0)

        if(factItems1 && factItems1[field.Id] && factItems1[field.Id][day+1])
          obj[`sumFactChild-${field.Id}-0`] = factItems1[field.Id][day +1].length + '\n' + factItems1[field.Id][day +1].reduce((p,c) => p+Number(c.oil), 0)

        // else {
        //   if(field.DailySum[day] && (field.DailySum[day][0] || field.DailySum[day][1])) 
        //     obj[`sumPlanChild-${field.Id}-0`] = (field.DailySum[day][0] ?? '') + '\n' + (field.DailySum[day][1] ?? '')
        //   if(field.DailySum[day] && (field.DailySum[day][2] || field.DailySum[day][3]))
        //     obj[`sumFactChild-${field.Id}-0`] = (field.DailySum[day][2] ?? '' )+ '\n' + (field.DailySum[day][3] ?? '')
        // }
      })

      return obj
    })
    temp.push({id: temp.length, day: 'ИТОГО:\nмер-тий'},{id: temp.length+1, day: 'Сум. прир.\nдеб. тн/сут.'},{id: temp.length+2, day: 'Накоп.\nдобыча, тн.'})
    setRowData(temp)
  }
  
  useEffect(()=>{
    sumUpdate()
  },[factItems1])

  // Данные основных столбцов
  const tableUpdate = () => {
    data.Partitions.map((itemCol, index) => {
      // itemCol.PlanItems.map((itemRow) => {
      //   const rowNode = gridRef.current!.api.getRowNode(moment(itemRow?.Day).subtract(1, 'days').format('D'))!
      //   itemRow?.Name && rowNode.setDataValue(`plan0-${itemCol.Id}-0`, itemRow?.Name.replace(/ /g, '\n') + '\n' + itemRow?.OilRate)
      // })

      if(factItems1) {
        for (const key in factItems1[itemCol.Id]) {
          const rowNode = gridRef.current!.api.getRowNode(Number(key)-1 + '')!
          factItems1[itemCol.Id][key].map((item, i) => {
            setTimeout(() => {
              rowNode.setDataValue(`fact0-${index}-${i}`, item.name+ '\n'+ item.shortName + '\n' + item.oil)
              factItems1[itemCol.Id] && factItems1[itemCol.Id][key] && rowNode.setDataValue(`sumFactChild-${itemCol.Id}-0`, factItems1[itemCol.Id][key].length + '\n' + factItems1[itemCol.Id][key].reduce((p,c) => p+Number(c.oil), 0))
            }, 200)
          })
        }

      } 
      // else {
      //   itemCol.FactItems.map((itemRow) => {
      //     const rowNode = gridRef.current!.api.getRowNode(moment(itemRow?.Day).subtract(1, 'days').format('D'))!
      //     itemRow?.Name && rowNode.setDataValue(`fact0-${itemCol.Id}-0`, itemRow?.Name.replace(/ /g, '\n') + '\n' + itemRow?.OilRate)
      //   })
      // }
    })
  }


  useEffect(() => {
    setTimeout(() => {
      tableUpdate()
    }, 100)
  }, [factItems1])

  return (
    <div className="ag-theme-quartz" style={{ height: '100%', width: '100%' }}>
      <AgGridReact
        ref={gridRef}
        {...styleOptions}
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        headerHeight={1}
        enableCellChangeFlash = {true}
        rowClassRules={{
          'border-top': (params) => params.data?.day === 'ИТОГО:\nмер-тий',
        }}
        //enableCellChangeFlash={true}
        rowHeight={42}
      />
    </div>
  )
}

export default Table
