import React, { useRef, useState }  from 'react'
// import useStore, {StoreType} from '../../store'
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
  'Базовый дебит ГТМ и Оптимизация скважин': 22,
  'Текущий простой': 40,
  'Рост потенциала простоя (в т.ч.остановки скв. для ГТМ, оптимизацию, нерентабельный фонд, по распоряжению)': 25,
  'Перевод скважин в ППД': 27,
  'Итого (с ВНР)': 23, // прочая добыча
  'Геол. снижение,  т/сут': 36,
  'Итого (с ВСП)': 47 // прочие потери
}

// Восстановление потенциала простоя (Текущий простой + Базовый дебит ГТМ и Оптимизация скважин )-> Сокращение пп
// Потенциал по графику -> Потенциал простоя
// Ошибка нерент фон
// 16й столбец -> Накопленный эффект по базовому дебиту

const nameColList = Object.keys(obj)

function getKeyByValue(object, value) {
  // console.log(object, value)
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
  // console.log(object, value)
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
  // const month = useStore((state : StoreType) => state.month)
  // const setMonth = useStore((state : StoreType) => state.setMonth)
  const setFactItems = useDataStore((state : DataStoreType) => state.setFactItems)
  const setPlanItems = useDataStore((state : DataStoreType) => state.setPlanItems)
  const [starts, setStarts] = useState('')
  const [rgd, setRgd] = useState('')
  const fileFact = useRef(null)
  const fileInput = useRef(null)

  // const [fileRgd, setFileRgd] = useState()
  // const [workbook, setWorkbook] = useState([])

  // useEffect(() => {
  //   (async() =>{
  //     const url = 'http://localhost:3000/start.xls'
  //     const file = await (await fetch(url)).arrayBuffer()
  //     const wb = read(file)
  //     const keys = getKeyByValue(wb.Sheets?.report, 'Ввод новых ГС с МГРП')
  //     const fact = keys.map(item => ({
  //       date: wb.Sheets?.report['F'+item.slice(1)].w.substr(0, 2),
  //       name: wb.Sheets?.report['G'+item.slice(1)].w,
  //       shortName: wb.Sheets?.report['H'+item.slice(1)].w, 
  //       oil: 11
  //     }))
  //     // console.log(fact)
  //     setFactItems(fact)
  //     // console.log(wb.Sheets?.report)
  //     // console.log(getKeyByValue(wb.Sheets?.report, 'Ввод новых ГС с МГРП'))

  //     //setWorkbook(wb)
  //   })() 
  // }, [])
  
  // useEffect(() => {
  //   (async() =>{
  //     const url = 'http://localhost:3000/start.xls'
  //     const file = await (await fetch(url)).arrayBuffer()
  //     const wb = read(file)
  //     const keys = getKeyByValue(wb.Sheets?.report, 'Ввод новых')
  //     const fact = keys.map(item => ({
  //       date: wb.Sheets?.report['F'+item.slice(1)].w.substr(0, 2),
  //       name: wb.Sheets?.report['G'+item.slice(1)].w,
  //       shortName: wb.Sheets?.report['H'+item.slice(1)].w, 
  //       oil: wb.Sheets?.report['U'+item.slice(1)].w
  //     }))
  //     // console.log(fact)
  //     setFactItems(fact)
  //     // console.log(wb.Sheets?.report)
  //     // console.log(getKeyByValue(wb.Sheets?.report, 'Ввод новых ГС с МГРП'))
  //     //setWorkbook(wb)
  //   })() 
  // }, [])  

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
        const keys1 = getKeyByValue(wb.Sheets?.report, ['Ввод новых'])
        fact[1] = newGroupByDate(keys1.map(item => ({
          date: wb.Sheets?.report['F'+item.slice(1)].w.substr(0, 2),
          'Местор.': wb.Sheets?.report['G'+item.slice(1)].w,
          'N,N скважин': wb.Sheets?.report['H'+item.slice(1)].w, 
          'Эффект': wb.Sheets?.report['U'+item.slice(1)].w
        })))
  
        // ЗБС
        const keys2 = getKeyByValue(wb.Sheets?.report, ['Зарезка'])
        fact[2] = newGroupByDate(keys2.map(item => ({
          date: wb.Sheets?.report['F'+item.slice(1)].w.substr(0, 2),
          'Местор.': wb.Sheets?.report['G'+item.slice(1)].w,
          'N,N скважин': wb.Sheets?.report['H'+item.slice(1)].w, 
          'Эффект': wb.Sheets?.report['U'+item.slice(1)].w
        })))
  
        // ГРП
        const keys3_1 = getKeyByValue(wb.Sheets?.report, ['Гидроразрыв'])
        const keys3_2 = getKeyByValueStrong(wb.Sheets?.report, ['ГРП'])
  
        const keys3 = [...keys3_1, ...keys3_2]
        fact[5] = newGroupByDate(keys3.map(item => ({
          date: wb.Sheets?.report['F'+item.slice(1)].w.substr(0, 2),
          'Местор.': wb.Sheets?.report['G'+item.slice(1)].w,
          'N,N скважин': wb.Sheets?.report['H'+item.slice(1)].w, 
          'Эффект': wb.Sheets?.report['U'+item.slice(1)].w
        })))
  
        //Возврат
        const keys4 = getKeyByValue(wb.Sheets?.report, ['Возврат', 'Перевод на', 'Приобщение пласта'])
        fact[3] = newGroupByDate(keys4.map(item => ({
          date: wb.Sheets?.report['F'+item.slice(1)].w.substr(0, 2),
          'Местор.': wb.Sheets?.report['G'+item.slice(1)].w,
          'N,N скважин': wb.Sheets?.report['H'+item.slice(1)].w, 
          'Эффект': wb.Sheets?.report['U'+item.slice(1)].w
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
      const file = fileInput.current.files[0]

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
          if(obj[key] !== 0) tempo[obj[key]] = parsingData[key]
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
        <Attachment {...props} style={{ width: 138, marginRight: -8 }}
          withPictogram
          fileName="Запуски скважин"
          fileExtension={starts}
          size='xs'
        />}
    </FileField>

    <FileField  id="FileFieldWithText3" inputRef={fileInput} onChange={importRgd}>
      {(props) => <Attachment {...props} style={{ width: 138, marginRight: -8 }}
        withPictogram
        fileName="Расчёт графика добычи"
        fileExtension={rgd}
        size='xs'
      />}
    </FileField>
  </div>)
}

export default Files