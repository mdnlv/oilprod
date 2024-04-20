/* eslint-disable no-var */
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

const rr = (el: number) => {
  const temp = ((el ^ 0) === el) ? el : Number(el.toFixed(1))
  return (String(temp).includes('.0')? Math.round(temp) : temp)
}
  
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
  const column34 = useDataStore((state : DataStoreType) => state.column34)
  const column = useDataStore((state : DataStoreType) => state.column)

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
            params.api.cutToClipboard()

            setTimeout(() => {
              tableUpdate()
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
            params.api.cutToClipboard()
            setTimeout(() => {
              tableUpdate()
            }, 200)
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
    }, 100)
  }, [factItems, planItems, days])
  
  // Cтолбцы
  const updateColumns = () => {
    const tempColumnDefs: Array<object> = [{field: 'day', headerName: '', pinned: 'left', fontSize: 8, width: 80,
      editable: false, cellStyle: { backgroundColor: '#ecf1f4', borderRight: '3px solid #ccd9e0'  } }, 
    ...data.Partitions.map((item) => { 
      if(item.Id !== 24) {
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
            planItems[item.Id] && children.push({field: 'plan', headerName: 'план',
              children: [...temp.map((_, i) =>
                ({field: `plan-${item.Id}-${i}`, headerName: '', cellStyle: { backgroundColor: colors.LightGray },
                  cellRenderer: cellRenderer, cellEditor: cellEditor, cellEditorPopup: true
                })),
              {field: `plan-${item.Id}-${temp.length}`, headerName: '', cellStyle: { backgroundColor: colors.LightGray },
                cellRenderer: cellRenderer, cellEditor: cellEditor, cellEditorPopup: true
              }
              ] 
            })
          }  else {
            item.PlanItems.length !== 0 && children.push({field: 'plan', headerName: 'план',
              children: [
                {field: `plan-${item.Id}-0`, headerName: '',  cellStyle: { backgroundColor: colors.LightGray },
                  cellRenderer: cellRenderer, cellEditor: cellEditor, cellEditorPopup: true
                }
              ] 
            })
          }
  
          if(factItems && factItems[item.Id]) {
            let temp = []
            for (const i in factItems[item.Id]) {
              if(factItems[item.Id][i].length > temp.length) temp = factItems[item.Id][i]
            }
        
            factItems[item.Id] && children.push({field: 'fact', headerName: 'факт',
              children: [...temp.map((_, i) =>
                ({field: `fact-${item.Id}-${i}`, headerName: '',
                  cellRenderer: cellRenderer, cellEditor: cellEditor, cellEditorPopup: true
                })
              ),
              {field: `fact-${item.Id}-${temp.length}`, headerName: '',
                cellRenderer: cellRenderer, cellEditor: cellEditor, cellEditorPopup: true
              }] 
            })    
          } else {
            item.FactItems.length !== 0 && children.push({field: 'fact', headerName: 'факт',
              children: [
                {field: `fact-${item.Id}-0`, headerName: '',
                  cellRenderer: cellRenderer, cellEditor: cellEditor, cellEditorPopup: true
                }
              ] 
            })
          }
        }
  
        return ({field: item.Id.toString(), headerName: item.Name, minWidth: 80, borderRight: '3px solid #ccd9e0', 
          headerTooltip: item.Name,
          children: [...children,
            {field: `sumPlan-${item.Id}`, headerName: 'итого\nплан',
              children: [
                {field: `sumPlan-${item.Id}-0`, editable: false, headerName: '', cellStyle: { 
                  backgroundColor: item.Color ? colors[item.Color].left : '#fff', alignItems: 'flex-end', paddingBottom: 3 
                }}
              ]
            }, 
            {field: `sumFact-${item.Id}`, headerName: 'итого\nфакт', 
              children: [
                {field: `sumFact-${item.Id}-0`, editable: false, headerName: '', cellStyle: { 
                  backgroundColor: item.Color ? colors[item.Color].right : '#fff', 
                  borderRight: `${(item.Id === 23 || item.Id === 24)? '5' : '3'}px solid #ccd9e0`, 
                  alignItems: 'flex-end', paddingBottom: 3 
                }}
              ]},
          ]
        })  
      }
    })]
    setColumnDefs(tempColumnDefs)
  }

  // Данные столбцов
  const tableUpdate = () => {
    const rowNodeCount = gridRef.current!.api.getRowNode(days + '')!
    const rowNodeWeight = gridRef.current!.api.getRowNode(days + 1 + '')!
    const rowNodeAccum = gridRef.current!.api.getRowNode(days + 2 + '')!
    
    data.Partitions.map((itemCol) => {
      if(factItems && factItems[itemCol.Id]) {
        let sumCount = 0
        let sumWeight = 0
        
        for (const key in factItems[itemCol.Id]) {
          const rowNode = gridRef.current!.api.getRowNode(Number(key)-1 + '')!

          Number(key) <= days && factItems[itemCol.Id][key].map((item, i) => {
            rowNode.setDataValue(`fact-${itemCol.Id}-${i}`, item['Местор.'] + '\n'+ item['N,N скважин'] + '\n' + Math.round(Number(item['Эффект'])))

            const cf = factItems[itemCol.Id][key].length
            const qf = factItems[itemCol.Id][key].reduce((p,c) => p+Math.round(Number(c['Эффект'])), 0)

            sumCount++
            sumWeight += Number(item['Эффект'])

            rowNode.setDataValue(`sumFact-${itemCol.Id}-0`, cf + '\n' + qf)
            rowNodeCount.setDataValue(`sumFact-${itemCol.Id}-0`, sumCount)
            rowNodeWeight.setDataValue(`sumFact-${itemCol.Id}-0`, sumWeight)
          }) 

        }
      } 
      
      if(planItems && planItems[itemCol.Id]) {
        let sumCount = 0
        let sumWeight = 0
        let accum = 0
        let accumBuffer = 0

        for (const key in planItems[itemCol.Id]) {
          const rowNode = gridRef.current!.api.getRowNode(Number(key)-1 + '')!

          Number(key) <= days && planItems[itemCol.Id][key].map((item, i) => {
            const m = item['Местор.'] ? item['Местор.'] : ''  
            const n = item['N,N скважин'] ? item['N,N скважин'] : ''
                
            if(struct.find(item => item.id === itemCol.Id).total) {
              sumCount++
              sumWeight += Number(item['Эффект'])

              rowNode.setDataValue(`sumPlan-${itemCol.Id}-0`,  m + '\n'+ n + '\n' + Math.round(Number(item['Эффект'])))
              if ( itemCol.Id === 40 
                    || itemCol.Id === 47 
                    || itemCol.Id === 36 
                    || itemCol.Id === 33
                    || itemCol.Id === 31
                    || itemCol.Id === 32
                    || itemCol.Id === 41
                    || itemCol.Id === 23 ) rowNodeAccum.setDataValue(`sumPlan-${itemCol.Id}-0`, rr(sumWeight))
              else {
                rowNodeCount.setDataValue(`sumPlan-${itemCol.Id}-0`, rr(sumCount))
                rowNodeWeight.setDataValue(`sumPlan-${itemCol.Id}-0`, rr(sumWeight))
              }
              if ( itemCol.Id === 40 ) rowNodeWeight.setDataValue(`sumPlan-${itemCol.Id}-0`, rr(sumWeight / days))
            } else {
              rowNode.setDataValue(`plan-${itemCol.Id}-${i}`, m + '\n'+ n + '\n' + Math.round(Number(item['Эффект'])))
              const cp = planItems[itemCol.Id][key].length
              const qp = planItems[itemCol.Id][key].reduce((p,c) => p+Math.round(Number(c['Эффект'])), 0)

              sumCount++
              sumWeight += Number(item['Эффект'])

              rowNode.setDataValue(`sumPlan-${itemCol.Id}-0`, cp + '\n' + qp)
              rowNodeCount.setDataValue(`sumPlan-${itemCol.Id}-0`, rr(sumCount))
              rowNodeWeight.setDataValue(`sumPlan-${itemCol.Id}-0`, rr(sumWeight))

              itemCol.Id !== 16 && rowNodeAccum.setDataValue(`sumPlan-${itemCol.Id}-0`, rr(accum + sumWeight))
            }
          })
          accumBuffer = sumWeight

          itemCol.Id === 16 && rowNodeAccum.setDataValue(`sumPlan-${itemCol.Id}-0`, rr(accum + sumWeight))
          accum += accumBuffer
        }
      }

      const Column = {
        14: column([1, 2, 5, 3]),
        21: column([16, 4, 17, 18, 20]),
        29: column([25, 26, 27, 28]),
        34: column34()
      }

      if(Column[itemCol.Id] && (itemCol.Id == 14 || itemCol.Id == 21 || itemCol.Id == 29)) {
        let bufferFact = 0
        let bufferPlan = 0
        let countFact = 0
        let countPlan = 0
        let accumFact = 0
        let accumPlan = 0
        let accumFactBuffer = 0
        let accumPlanBuffer = 0
        let bufferFactSum = 0
        let bufferPlanSum = 0

        for(let key = 0; key <= days; key++) {
          const rowNode = gridRef.current!.api.getRowNode(Number(key-1) + '')!
          accumFact += accumFactBuffer
          accumPlan += accumPlanBuffer

          if(Column[itemCol.Id][key]) {
            bufferFact += Column[itemCol.Id][key].fact.w
            bufferPlan += Column[itemCol.Id][key].plan.w
            countFact += Column[itemCol.Id][key].fact.c
            countPlan += Column[itemCol.Id][key].plan.c
            accumFactBuffer += Column[itemCol.Id][key].fact.w
            accumPlanBuffer += Column[itemCol.Id][key].plan.w

            if(Number(key) <= days) {
              Column[itemCol.Id][key].fact.c > 0 && 
                  rowNode.setDataValue(`sumFact-${itemCol.Id}-0`, '\n'+ Column[itemCol.Id][key].fact.c + '\n' + rr(Column[itemCol.Id][key].fact.w))
              Column[itemCol.Id][key].plan.c > 0 && 
                  rowNode.setDataValue(`sumPlan-${itemCol.Id}-0`, '\n'+ Column[itemCol.Id][key].plan.c + '\n' + rr(Column[itemCol.Id][key].plan.w))
            }
          }

          bufferFactSum += bufferFact
          bufferPlanSum += bufferPlan
          bufferFact > 0 && rowNode.setDataValue(`sumFact-${itemCol.Id+1}-0`, '\n\n' + rr(bufferFact))
          bufferPlan > 0 && rowNode.setDataValue(`sumPlan-${itemCol.Id+1}-0`, '\n\n'+ rr(bufferPlan))
        }

        const acPlan = accumPlan + bufferPlan
        countPlan > 0 && rowNodeCount.setDataValue(`sumPlan-${itemCol.Id}-0`, countPlan)
        bufferPlan > 0 && rowNodeWeight.setDataValue(`sumPlan-${itemCol.Id}-0`, bufferPlan)
        acPlan > 0 && rowNodeAccum.setDataValue(`sumPlan-${itemCol.Id}-0`,  rr(acPlan))
        countFact > 0 && rowNodeCount.setDataValue(`sumFact-${itemCol.Id}-0`, countFact)
        bufferFact > 0 && rowNodeWeight.setDataValue(`sumFact-${itemCol.Id}-0`, bufferFact)
        accumFact > 0 && rowNodeAccum.setDataValue(`sumFact-${itemCol.Id}-0`, rr(accumFact))
        bufferFactSum > 0 && rowNodeAccum.setDataValue(`sumFact-${itemCol.Id+1}-0`, rr(bufferFactSum))
        bufferPlanSum > 0 && rowNodeAccum.setDataValue(`sumPlan-${itemCol.Id+1}-0`, rr(bufferPlanSum))
      }

      if(Column[itemCol.Id] && itemCol.Id == 34) {
        let bufferFact = 0
        let bufferPlan = 0

        for(let key = 0; key <= days; key++) {
          const rowNode = gridRef.current!.api.getRowNode(Number(key-1) + '')!
          if(Column[itemCol.Id][key]) {
            bufferFact += Column[itemCol.Id][key].fact
            bufferPlan += Column[itemCol.Id][key].plan
            if(Number(key) <= days) {
              Column[itemCol.Id][key].fact > 0 && 
                  rowNode.setDataValue(`sumFact-${itemCol.Id}-0`,  Column[itemCol.Id][key].fact)
              Column[itemCol.Id][key].plan > 0 && 
                  rowNode.setDataValue(`sumPlan-${itemCol.Id}-0`, rr(Column[itemCol.Id][key].plan))
            }
          }

          bufferFact > 0 && rowNodeAccum.setDataValue(`sumFact-${itemCol.Id}-0`, bufferFact)
          bufferPlan > 0 && rowNodeAccum.setDataValue(`sumPlan-${itemCol.Id}-0`, rr(bufferPlan))
        }
      }

      if(Column[itemCol.Id] && Column[14] && itemCol.Id == 24) {
        let bufferFact = 0
        let bufferPlan = 0
        for(let key = 1; key <= days; key++) {
          const rowNode = gridRef.current!.api.getRowNode(Number(key-1) + '')!
          const fact =  (Column[14][key] ? Column[14][key].fact.w : 0) + (Column[itemCol.Id][key] ? Column[itemCol.Id][key]?.fact.w : 0) 
              + (factItems && factItems[23] && factItems[23][key] ? Number(factItems[23][key][0]['Эффект']) : 0)

          const plan = (Column[14][key] ? Column[14][key]?.plan.w  : 0)  +  (Column[itemCol.Id][key] ?  Column[itemCol.Id][key]?.plan.w : 0)
             + (planItems && planItems[23][String(key).length === 1 ? '0' + String(key) : String(key)] ? Number(planItems[23][String(key).length === 1 ? '0' + String(key) : String(key)][0]['Эффект']) : 0)
            
          bufferFact += fact
          bufferPlan += plan

          fact > 0 && rowNode.setDataValue(`sumFact-${itemCol.Id}-0`, fact)
          plan > 0 && rowNode.setDataValue(`sumPlan-${itemCol.Id}-0`, plan)
        }

        setTimeout(() => {
          bufferPlan > 0 && rowNodeWeight.setDataValue(`sumPlan-${itemCol.Id}-0`, bufferPlan)
          bufferFact > 0 && rowNodeWeight.setDataValue(`sumFact-${itemCol.Id}-0`, bufferFact)
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
