import React, { useRef, useState }  from 'react'
import { FileField } from '@consta/uikit/FileField'
import { read } from 'xlsx'
import useDataStore, { DataStoreType } from '../../store/data'
import { Attachment } from '@consta/uikit/Attachment'
import parsingXLSX from './script'

const obj = {
  'Ввод новых скважин': 1,
  'Зарезка бокового ствола': 2,
  'ГРП': 5,
  'Возврат': 3,
  'Оптимизация': 16,
  'Работа с переходящим фондом': 4,
  'Ввод из БД ТГ (без инвест.)': 17,
  'Базовый дебит ГТМ и Оптимизация скважин': 20,
  'Текущий простой': 20,
  'Рост потенциала простоя (в т.ч.остановки скв. для ГТМ, оптимизацию, нерентабельный фонд, по распоряжению)': 25,
  'Перевод скважин в ППД': 28,
  'Итого (с ВНР)': 23,
  'Геол. снижение,  т/сут': 36,
  'Итого (с ВСП)': 47,
  'Потенциал по графику': 40,
  'Нараст.  по потенциалу': 22
}

const nameColList = Object.keys(obj)

function getKeyByValue(object, value) {
  return Object.keys(object).filter(key => {
    for(const i of value) {
      if ((object[key].v + '').indexOf(i) > -1) {
        return true
      }
    }
    return false
  })
}

function getKeyByValueStrong(object, value) {
  return Object.keys(object).filter(key => {
    for(const i of value) {
      if ((object[key].v + '') === i) {
        return true
      }
    }
    return false
  })
}

function newGroupByDate(arr) {
  const temp = arr.reduce((acc, item) => {
    const date = item.date
    if (acc[date]) {
      acc[date].push(item)
    } else {
      acc[Number(date)] = [item]
    }
    return acc
  }, {})
  return temp
}

const Files: React.FC = () => {
  const setFactItems = useDataStore((state : DataStoreType) => state.setFactItems)
  const setPlanItems = useDataStore((state : DataStoreType) => state.setPlanItems)
  const [starts, setStarts] = useState('')
  const [rgd, setRgd] = useState('')
  const fileFact = useRef(null)
  const filePlan = useRef(null)

  // Факт
  const importUsoi = () => {
    (async() =>{   
      const reader = new FileReader()
      const fileF = fileFact.current.files[0]
      reader.onerror = (event) => {
        console.log('File could not be read! Code ' + event.target.error.code)
      }
      reader.readAsBinaryString(fileF)
      reader.onload = (event) => {
        const dataFile = event.target.result
        const wb = read(dataFile, { type: 'binary' })
        
        const fact = {}
        // ВНС
        const keys1 = getKeyByValue(wb.Sheets['Запуски скважин АО ГПН-ННГ'], ['Ввод новых'])
        fact[1] = newGroupByDate(keys1.map(item => ({
          date: wb.Sheets['Запуски скважин АО ГПН-ННГ']['F'+item.slice(1)].w.substr(0, 2),
          'Местор.': wb.Sheets['Запуски скважин АО ГПН-ННГ']['G'+item.slice(1)].w,
          'N,N скважин': wb.Sheets['Запуски скважин АО ГПН-ННГ']['H'+item.slice(1)].w, 
          'Эффект': wb.Sheets['Запуски скважин АО ГПН-ННГ']['U'+item.slice(1)].w
        })))
  
        // ЗБС
        const keys2 = getKeyByValue(wb.Sheets['Запуски скважин АО ГПН-ННГ'], ['Зарезка'])
        fact[2] = newGroupByDate(keys2.map(item => ({
          date: wb.Sheets['Запуски скважин АО ГПН-ННГ']['F'+item.slice(1)].w.substr(0, 2),
          'Местор.': wb.Sheets['Запуски скважин АО ГПН-ННГ']['G'+item.slice(1)].w,
          'N,N скважин': wb.Sheets['Запуски скважин АО ГПН-ННГ']['H'+item.slice(1)].w, 
          'Эффект': wb.Sheets['Запуски скважин АО ГПН-ННГ']['U'+item.slice(1)].w
        })))
  
        // ГРП
        const keys3_1 = getKeyByValue(wb.Sheets['Запуски скважин АО ГПН-ННГ'], ['Гидроразрыв'])
        const keys3_2 = getKeyByValueStrong(wb.Sheets['Запуски скважин АО ГПН-ННГ'], ['ГРП'])
  
        const keys3 = [...keys3_1, ...keys3_2]
        fact[5] = newGroupByDate(keys3.map(item => ({
          date: wb.Sheets['Запуски скважин АО ГПН-ННГ']['F'+item.slice(1)].w.substr(0, 2),
          'Местор.': wb.Sheets['Запуски скважин АО ГПН-ННГ']['G'+item.slice(1)].w,
          'N,N скважин': wb.Sheets['Запуски скважин АО ГПН-ННГ']['H'+item.slice(1)].w, 
          'Эффект': wb.Sheets['Запуски скважин АО ГПН-ННГ']['U'+item.slice(1)].w
        })))
  
        //Возврат
        const keys4 = getKeyByValue(wb.Sheets['Запуски скважин АО ГПН-ННГ'], ['Возврат', 'Перевод на', 'Приобщение пласта'])
        fact[3] = newGroupByDate(keys4.map(item => ({
          date: wb.Sheets['Запуски скважин АО ГПН-ННГ']['F'+item.slice(1)].w.substr(0, 2),
          'Местор.': wb.Sheets['Запуски скважин АО ГПН-ННГ']['G'+item.slice(1)].w,
          'N,N скважин': wb.Sheets['Запуски скважин АО ГПН-ННГ']['H'+item.slice(1)].w, 
          'Эффект': wb.Sheets['Запуски скважин АО ГПН-ННГ']['U'+item.slice(1)].w
        })))
  
        setFactItems(fact)
        setStarts('xls')
      }
    })() 
  }

  // План
  const importRgd = () => {
    (async() => {
      const reader = new FileReader()
      const file = filePlan.current.files[0]

      reader.onerror = (event) => {
        console.log('File could not be read! Code ' + event.target.error.code)
      }
      reader.readAsBinaryString(file)
      reader.onload = (event) => {
        const dataFile = event.target.result
        const parsingData = parsingXLSX.parse(
          dataFile,
          nameColList
        )
        const tempo = {}
        for (const key in parsingData) {
          if(obj[key] !== 0) {
            if(!tempo[obj[key]]) { 
              tempo[obj[key]] = parsingData[key] 
            } else {
              for (const i in parsingData[key]) {  
                tempo[obj[key]][i] 
                  ? tempo[obj[key]][i] = [...tempo[obj[key]][i], ...parsingData[key][i]] 
                  : tempo[obj[key]][i] = parsingData[key][i]
              }
            } 
          }   
        }
        setPlanItems(tempo)
        setRgd('xls')
      }
    })() 
  }

  return (<div style={{
    display: 'flex', 
    flexDirection: 'row', 
    width: '100%', 
    justifyContent: 'space-between',
    alignItems: 'center',
  }}>
    <FileField id="FileFieldWithText1" inputRef={fileFact} onChange={importUsoi}>
      {(props) =>       
        <Attachment {...props} style={{ width: 122, marginRight: -8 }}
          withPictogram
          fileName="Загрузить УСОИ"
          fileExtension={starts}
          size='xs'
        />}
    </FileField>
    <FileField  id="FileFieldWithText3" inputRef={filePlan} onChange={importRgd}>
      {(props) => <Attachment {...props} style={{ width: 122, marginRight: -20 }}
        withPictogram
        fileName="Загрузить РГД"
        fileExtension={rgd}
        size='xs'
      />}
    </FileField>
  </div>)
}

export default Files