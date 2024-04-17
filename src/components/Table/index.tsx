/* eslint-disable react/display-name */
import React, {  useCallback, useEffect, useRef, useState} from 'react'
import { agGridAdapter } from '@consta/ag-grid-adapter/agGridAdapter'
import { AgGridReact } from 'ag-grid-react'
import moment from 'moment'
import data from '../../store/json/test.json'
import struct from '../../store/json/struct.json'
import useStore, {StoreType} from '../../store'
import { Text } from '@consta/uikit/Text'
import useDataStore, { DataStoreType } from '../../store/data'
import { Button } from '@consta/uikit/Button'
import 'ag-grid-enterprise'
import { GetContextMenuItemsParams, MenuItemDef } from 'ag-grid-community'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cellRenderer = (params: any) => {
  return <div style={{display: 'flex', flexDirection: 'column'}}>{params.value}</div>
}

const defaultColDef = {
  flex: 1,
  minWidth: 60,
  resizable: true,
  suppressMovable: true,
  fontSize: 8,
  editable: true,
  headerComponentParams: {
    transform: 'uppercase',
    view: 'brand',  
    align: 'right',
  },
  cellStyle: { whiteSpace: 'pre' }
}

const styleOptions = agGridAdapter({
  size: 's',
  borderBetweenColumns: true,
  borderBetweenRows: true,
  headerView: 'clear',
})
  
const Table: React.FC = () => {
  const gridRef = useRef(null)
  const days = moment(useStore((state : StoreType) => state.month)).daysInMonth()
  const [rowData, setRowData] = useState([])
  const [columnDefs, setColumnDefs] = useState([])
  const factItems = useDataStore((state : DataStoreType) => state.FactItems)
  const planItems = useDataStore((state : DataStoreType) => state.PlanItems)
  const cellUpdate = useDataStore((state : DataStoreType) => state.cellUpdate)
  const clipboard = useDataStore((state : DataStoreType) => state.clipboard)
  const setClipboard = useDataStore((state : DataStoreType) => state.setClipboard)
  const column14 = useDataStore((state : DataStoreType) => state.column14)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cellEditor = (params: any) => {
    const [input0, setInput0] = useState('')
    const [input1, setInput1] = useState('')
    const [input2, setInput2] = useState('')
    const refContainer = useRef<HTMLDivElement>(null)
    const values = params.value?.split(/(\n)/)
    
    useEffect(() => {
      refContainer.current?.focus()
      if(values) {
        setInput0(values[0])
        setInput1(values[2])
        setInput2(values[4])
      }
    }, [])

    return (
      <div
        ref={refContainer}
        style={{
          border: '1px solid grey',
          backgroundColor: '#f2f2f2',
          padding: 8,
          paddingBottom: 4,
          marginTop: 3,
          marginLeft: 3,
          display: 'inline-block',
          borderRadius: 2,
          width: 180,
        }}
        tabIndex={1} // important - without this the key presses wont be caught
      >
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <input placeholder="Месторождение" value={input0} onChange={(e) => {setInput0(e.target.value)}} style={{marginBottom: 2}}/>
          <input placeholder="Скважина" value={input1} onChange={(e) => {setInput1(e.target.value)}} style={{marginBottom: 2}}/>
          <input placeholder="Qн" value={input2} onChange={(e) => {setInput2(e.target.value.replace(/[^\d-]|\b-/, '') )}} style={{marginBottom: 2}}/>
          <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems:'baseline', marginTop: 6}}>
            <Text size="xs" view="linkMinor" style={{marginBottom: 8}}>{params.data.day} февраля</Text>
            <Button size="xs" label="Сохранить" style={{marginLeft: 7}} disabled={input0 === '' && input1 === '' && input2 === ''} onClick={() => {
              const colId =  params.colDef.field.slice((params.colDef.field.indexOf('-') + 1), params.colDef.field.lastIndexOf('-'))
              const colIndex = params.colDef.field.slice(params.colDef.field.lastIndexOf('-') +1)
              const colType = params.colDef.field.slice(0, 4)
              cellUpdate({
                day: Number(params.data.day),
                newPlaceName: input0,
                newPlaceNum: input1,
                newWeight: input2,
                colId: Number(colId),
                colIndex: Number(colIndex),
                colType: colType
              })

              params.api.stopEditing()
              updateColumns()
              setTimeout(() => {
                tableUpdate()
              }, 200)
            }} />
          </div>
        </div>
      </div>
    )
  }

  const getContextMenuItems = useCallback(
    (params: GetContextMenuItemsParams): (string | MenuItemDef)[] => {
      const colId =  params.column.getColId().slice((params.column.getColId().indexOf('-') + 1), params.column.getColId().lastIndexOf('-'))
      const colIndex = params.column.getColId().slice(params.column.getColId().lastIndexOf('-') +1)
      const colType = params.column.getColId().slice(0, 4)

      const result: (string | MenuItemDef)[] = [
        {
          name: 'Копировать',
          disabled: params.value ? false : true,
          action: () => {
            setClipboard({
              day: Number(params.node.data.day),
              colId: Number(colId),
              colIndex: Number(colIndex),
              colType: colType
            })
          },
          icon: '<img src="./assets/copy.png" />',
        },
        {
          name: 'Вставить',
          disabled: clipboard ? false : true,
          action: () => {
            cellUpdate({
              day: Number(params.node.data.day),
              newPlaceName: clipboard['Местор.'],
              newPlaceNum: clipboard['N,N скважин'],
              newWeight: clipboard['Эффект'],
              colId: Number(colId),
              colIndex: Number(colIndex),
              colType: colType
            })
            setTimeout(() => {
              tableUpdate()
            }, 100)
          },
          icon: '<img src="./assets/paste.png" />',
        },
        {
          name: 'Вырезать',
          disabled: params.value ? false : true,

          action: () => {
            setClipboard({
              day: Number(params.node.data.day),
              colId: Number(colId),
              colIndex: Number(colIndex),
              colType: colType
            })

            cellUpdate({
              day: Number(params.node.data.day),
              newPlaceName: null,
              newPlaceNum: null,
              newWeight: null,
              colId: Number(colId),
              colIndex: Number(colIndex),
              colType: colType
            })

            tableUpdate()
            setTimeout(() => {
              updateColumns()
            }, 200)
          },

          icon: '<img src="./assets/cut.png" />',
        },
        'separator',
        {
          name: 'Удалить',
          disabled: params.value ? false : true,
          action: () => {
            cellUpdate({
              day: Number(params.node.data.day),
              newPlaceName: null,
              newPlaceNum: null,
              newWeight: null,
              colId: Number(colId),
              colIndex: Number(colIndex),
              colType: colType
            })
            // setTimeout(() => {
            //   updateColumns()
            //   tableUpdate()
            // }, 200)
          },
          icon: '<img src="./assets/delete.png" />',
        }
      ]
      return result
    }, [clipboard]
  )

  useEffect(() => {
    const tempo = [...Array(days)].map((_, day) => ({ id: day,  day: (day+1).toString() } ))
    tempo.push({id: 32, day: 'ИТОГО:\nмер-тий'}, {id: 33, day: 'Сум. прир.\nдеб. тн/сут.'}, {id: 33, day: 'Накоп.\nдобыча, тн.'})
    setRowData(tempo)

    updateColumns()
    setTimeout(() => {
      tableUpdate()
    }, 300)
  }, [factItems, planItems, days])
  
  // Cтолбцы
  const updateColumns = () => {
    const tempColumnDefs: Array<object> = [{field: 'day', headerName: '', pinned: 'left', fontSize: 8, width: 80,
      editable: false, cellStyle: { backgroundColor: '#ecf1f4', borderRight: '3px solid #ccd9e0'  } }, 
    ...data.Partitions.map((item) => {
   
      const colors = {
        'LightGray': '#f3f3f3 ',
        'LightBlue': {left:'rgb(223, 237, 246)', right: 'rgb(223, 237, 246)'},
        'LightGreen': {left: 'rgb(207, 248, 228)', right: 'rgb(207, 248, 228)'},
        'LightGreenRed': {left: 'rgb(207, 248, 228)', right: 'rgb(248, 215, 207)'}
      }

      const children = []

      if(!struct.find(el => el.id == item.Id)?.total){
        if(planItems && planItems[item.Id]) {
          let temp = []
          for (const i in planItems[item.Id]) {
            if(planItems[item.Id][i].length > temp.length) temp = planItems[item.Id][i]
          }
          planItems[item.Id] && children.push({field: 'plan0', headerName: 'план',
            children: [...temp.map((_, i) =>
              ({field: `plan0-${item.Id}-${i}`, headerName: '', cellStyle: { backgroundColor: colors.LightGray },
                cellRenderer: cellRenderer,
                cellEditor: cellEditor,
                cellEditorPopup: true
              })),
            {field: `plan0-${item.Id}-${temp.length}`, headerName: '', cellStyle: { backgroundColor: colors.LightGray },
              cellRenderer: cellRenderer,
              cellEditor: cellEditor,
              cellEditorPopup: true
            }
            ] 
          })
        }  else {
          item.PlanItems.length !== 0 && children.push({field: 'plan0', headerName: 'план',
            children: [
              {field: `plan0-${item.Id}-0`, headerName: '',  cellStyle: { backgroundColor: colors.LightGray },
                cellRenderer: cellRenderer,
                cellEditor: cellEditor,
                cellEditorPopup: true
              }
            ] 
          })
        }

        if(factItems && factItems[item.Id]) {
          let temp = []
          for (const i in factItems[item.Id]) {
            if(factItems[item.Id][i].length > temp.length) temp = factItems[item.Id][i]
          }
    
          factItems[item.Id] && children.push({field: 'fact0', headerName: 'факт',
            children: [...temp.map((_, i) =>
              ({field: `fact0-${item.Id}-${i}`, headerName: '',
                cellRenderer: cellRenderer,
                cellEditor: cellEditor,
                cellEditorPopup: true
              })
            ),
            {field: `fact0-${item.Id}-${temp.length}`, headerName: '',
              cellRenderer: cellRenderer,
              cellEditor: cellEditor,
              cellEditorPopup: true
            }] 
          })    
        } else {
          item.FactItems.length !== 0 && children.push({field: 'fact0', headerName: 'факт',
            children: [
              {field: `fact0-${item.Id}-0`, headerName: '',
                cellRenderer: cellRenderer,
                cellEditor: cellEditor,
                cellEditorPopup: true
              }
            ] 
          })
        }
      }

      return ({field: item.Id.toString(), headerName: item.Name, minWidth: 80, borderRight: '3px solid #ccd9e0', headerTooltip: item.Name,
        children: [...children,
          {field: `sumPlan-${item.Id}`, headerName: 'итого\nплан',
            children: [
              {field: `sumPlanChild-${item.Id}-0`, editable: false, headerName: '', cellStyle: { backgroundColor: item.Color ? colors[item.Color].left : '#fff', alignItems: 'flex-end', paddingBottom: 3 }}
            ]
          }, 
          {field: `sumFact-${item.Id}`, headerName: 'итого\nфакт', 
            children: [
              {field: `sumFactChild-${item.Id}-0`, editable: false, headerName: '', cellStyle: { backgroundColor: item.Color ? colors[item.Color].right : '#fff', borderRight: `${item.Id === 24 ? '5' : '3'}px solid #ccd9e0`, alignItems: 'flex-end', paddingBottom: 3 }}
            ]},
        ]})
    })]
    setColumnDefs(tempColumnDefs)
  }

  // Данные столбцов
  const tableUpdate = () => {
    const rowNodeCount = gridRef.current!.api.getRowNode(days + '')!
    const rowNodeWeight = gridRef.current!.api.getRowNode(days + 1 + '')!
    
    data.Partitions.map((itemCol) => {
      if(factItems) {
        let sumCount = 0
        let sumWeight = 0
        for (const key in factItems[itemCol.Id]) {
          const rowNode = gridRef.current!.api.getRowNode(Number(key)-1 + '')!
          
          Number(key) <= days && factItems[itemCol.Id][key].map((item, i) => {
            setTimeout(() => {
              rowNode.setDataValue(`fact0-${itemCol.Id}-${i}`, item['Местор.'] + '\n'+ item['N,N скважин'] + '\n' + Math.round(Number(item['Эффект'])))

              if(factItems[itemCol.Id] && factItems[itemCol.Id][key]) {
                const cf = factItems[itemCol.Id][key].length
                const qf = factItems[itemCol.Id][key].reduce((p,c) => p+Math.round(Number(c['Эффект'])), 0)

                sumCount = sumCount + 1
                sumWeight = sumWeight + Number(item['Эффект'])

                rowNode.setDataValue(`sumFactChild-${itemCol.Id}-0`, cf + '\n' + qf)

                rowNodeCount.setDataValue(`sumFactChild-${itemCol.Id}-0`, sumCount)
                rowNodeWeight.setDataValue(`sumFactChild-${itemCol.Id}-0`, sumWeight)
              }
            }, 100)
          })
        }
      } 
      
      if(planItems) {
        let sumCount = 0
        let sumWeight = 0
        for (const key in planItems[itemCol.Id]) {
          const rowNode = gridRef.current!.api.getRowNode(Number(key)-1 + '')!

          Number(key) <= days && planItems[itemCol.Id][key].map((item, i) => {
            setTimeout(() => {
              const m = item['Местор.'] ? item['Местор.'] : ''
              const n = item['N,N скважин'] ? item['N,N скважин'] : ''

              if(struct.find(item => item.id === itemCol.Id).total) {
                sumCount = sumCount + 1
                sumWeight = sumWeight + Number(item['Эффект'])

                rowNode.setDataValue(`sumPlanChild-${itemCol.Id}-0`,  m + '\n'+ n + '\n' + Math.round(Number(item['Эффект'])))
                rowNodeCount.setDataValue(`sumPlanChild-${itemCol.Id}-0`, (sumCount ^ 0) === sumCount ? sumCount : sumCount.toFixed(1))
                rowNodeWeight.setDataValue(`sumPlanChild-${itemCol.Id}-0`, (sumWeight ^ 0) === sumWeight ? sumWeight : sumWeight.toFixed(1))
              } else {
                rowNode.setDataValue(`plan0-${itemCol.Id}-${i}`, m + '\n'+ n + '\n' + Math.round(Number(item['Эффект'])))
                if(planItems[itemCol.Id] && planItems[itemCol.Id][key]) {
                  const cp = planItems[itemCol.Id][key].length
                  const qp = planItems[itemCol.Id][key].reduce((p,c) => p+Math.round(Number(c['Эффект'])), 0)

                  sumCount = sumCount + 1
                  sumWeight = sumWeight + Number(item['Эффект'])
  
                  rowNode.setDataValue(`sumPlanChild-${itemCol.Id}-0`, cp + '\n' + qp)

                  rowNodeCount.setDataValue(`sumPlanChild-${itemCol.Id}-0`, (sumCount ^ 0) === sumCount ? sumCount : sumCount.toFixed(1))
                  rowNodeWeight.setDataValue(`sumPlanChild-${itemCol.Id}-0`, (sumWeight ^ 0) === sumWeight ? sumWeight : sumWeight.toFixed(1))
                }
              }
            }, 100)
          })
        }
      }

      if(column14 && itemCol.Id == 14) {
        const columns = column14()

        setTimeout(() => {
          let bufferFact = 0
          let bufferPlan = 0

          for(let key = 0; key <= days; key++) {
            const rowNode = gridRef.current!.api.getRowNode(Number(key-1) + '')!

            if(columns[key]) {
              bufferFact += columns[key].fact.weight
              bufferPlan += columns[key].plan.weight
  
              if(Number(key) <= days) {
                columns[key].fact.count > 0 && 
                  rowNode.setDataValue('sumFactChild-14-0', '\n'+ columns[key].fact.count + '\n' + columns[key].fact.weight)
                columns[key].plan.count > 0 && 
                  rowNode.setDataValue('sumPlanChild-14-0', '\n'+ columns[key].plan.count + '\n' + columns[key].plan.weight)
              }
            }

            bufferFact > 0 && rowNode.setDataValue('sumFactChild-15-0', '\n\n' + bufferFact)
            bufferPlan > 0 && rowNode.setDataValue('sumPlanChild-15-0', '\n\n'+ bufferPlan)
          }

        }, 200)
      }
    })        
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
        tooltipShowDelay={0}
        tooltipHideDelay={2000}
        rowClassRules={{
          'border-top': (params) => params.data?.day === 'ИТОГО:\nмер-тий',
        }}
        rowHeight={42}
        allowContextMenuWithControlKey={true}
        getContextMenuItems={getContextMenuItems}
      />
    </div>
  )
}

export default Table
