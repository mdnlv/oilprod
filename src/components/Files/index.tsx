import React, { useState }  from 'react'
//import useStore, {StoreType} from '../../store'
import { FileField } from '@consta/uikit/FileField'
import { read } from 'xlsx'
import useDataStore, { DataStoreType } from '../../store/data'
import { Attachment } from '@consta/uikit/Attachment'
import parsingXLSX from './script'

const nameColList = [
  'Ввод новых скважин',
  'Зарезка бокового ствола',
  'ГРП',
  'Возврат',
  'Оптимизация',
  'Работа с переходящим фондом',
  'Ввод из БД ТГ (без инвест.)',
  'Базовый дебит ГТМ и Оптимизация скважин',
  'Текущий простой',
  'Рост потенциала простоя (в т.ч.остановки скв. для ГТМ, оптимизацию, нерентабельный фонд, по распоряжению)',
  'Перевод скважин в ППД',
  'Нараст.  по потенциалу',
  'ВНР',
  'Итого (с ВНР)',
  'Геол. снижение,  т/сут',
  'ИТОГО перевод в ППД',
  'ВСП',
  'Итого (с ВСП)',
  'Нараст. баланс'
]

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
  const [starts, setStarts] = useState('')
  const [stops, setStops] = useState('')
  const [rgd, setRgd] = useState('')

  // const [file, setFile] = useState()
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

  const importStarts = () => {
    (async() =>{
      const url = 'http://localhost:3000/start.xls'
      const file = await (await fetch(url)).arrayBuffer()
      const wb = read(file)
      const fact = {}
      
      // ВНС
      const keys1 = getKeyByValue(wb.Sheets?.report, ['Ввод новых'])
      fact[1] = newGroupByDate(keys1.map(item => ({
        date: wb.Sheets?.report['F'+item.slice(1)].w.substr(0, 2),
        name: wb.Sheets?.report['G'+item.slice(1)].w,
        shortName: wb.Sheets?.report['H'+item.slice(1)].w, 
        oil: wb.Sheets?.report['U'+item.slice(1)].w
      })))

      // ЗБС
      const keys2 = getKeyByValue(wb.Sheets?.report, ['Зарезка'])
      fact[2] = newGroupByDate(keys2.map(item => ({
        date: wb.Sheets?.report['F'+item.slice(1)].w.substr(0, 2),
        name: wb.Sheets?.report['G'+item.slice(1)].w,
        shortName: wb.Sheets?.report['H'+item.slice(1)].w, 
        oil: wb.Sheets?.report['U'+item.slice(1)].w
      })))

      // ГРП
      const keys3_1 = getKeyByValue(wb.Sheets?.report, ['Гидроразрыв'])
      const keys3_2 = getKeyByValueStrong(wb.Sheets?.report, ['ГРП'])

      const keys3 = [...keys3_1, ...keys3_2]
      fact[4] = newGroupByDate(keys3.map(item => ({
        date: wb.Sheets?.report['F'+item.slice(1)].w.substr(0, 2),
        name: wb.Sheets?.report['G'+item.slice(1)].w,
        shortName: wb.Sheets?.report['H'+item.slice(1)].w, 
        oil: wb.Sheets?.report['U'+item.slice(1)].w
      })))

      //Возврат
      const keys4 = getKeyByValue(wb.Sheets?.report, ['Возврат', 'Перевод на', 'Приобщение пласта'])
      console.log(keys4)
      fact[3] = newGroupByDate(keys4.map(item => ({
        date: wb.Sheets?.report['F'+item.slice(1)].w.substr(0, 2),
        name: wb.Sheets?.report['G'+item.slice(1)].w,
        shortName: wb.Sheets?.report['H'+item.slice(1)].w, 
        oil: wb.Sheets?.report['U'+item.slice(1)].w
      })))

      setFactItems(fact)
      setStarts('xls')
      //setWorkbook(wb)
    })() 
  }

  const importStops = () => {
    (async() =>{
      // const url = 'http://localhost:3000/stops.xls'
      setStops('xls')
    })() 
  }

  const importRgd = () => {
    (async() =>{
      const url = 'http://localhost:3000/rgd.xlsx'
      const file = await (await fetch(url)).arrayBuffer()
      const pageNumber = 2
      // console.log(wb.Sheets['Расчет_Суточной_Добычи_По_Датам'])
      setRgd('xls')

      const parsingData = parsingXLSX.parse(
        file,
        pageNumber,
        nameColList
      )
      console.log(parsingData)
      // const keys = getKeyByValue(wb.Sheets?.report, 'Ввод новых')
      // const fact = keys.map(item => ({
      //   date: wb.Sheets?.report['F'+item.slice(1)].w.substr(0, 2),
      //   name: wb.Sheets?.report['G'+item.slice(1)].w,
      //   shortName: wb.Sheets?.report['H'+item.slice(1)].w, 
      //   oil: wb.Sheets?.report['U'+item.slice(1)].w
      // }))
      // // console.log(fact)
      // setFactItems(fact)
      // // console.log(wb.Sheets?.report)
      // // console.log(getKeyByValue(wb.Sheets?.report, 'Ввод новых ГС с МГРП'))

      // //setWorkbook(wb)

      // const reader = new FileReader()

      // reader.onerror = (event) => {
      //   console.log('File could not be read! Code ' + event.target.error.code)
      // }

      // reader.readAsBinaryString(file)
      // reader.onload = (event) => {
      //   const dataFile = event.target.result
    })() 
  }

  return (<div style={{
    display: 'flex', 
    flexDirection: 'row', 
    width: '100%', 
    justifyContent: 'space-between',
    alignItems: 'center',
  }}>
    <FileField  id="FileFieldWithText1"  onChange={() => {
      importStarts()
      //setFile(e.target.files[0]?.name)
    }}>
      {(props) =>       
        <Attachment {...props} style={{ width: 138, marginRight: -8 }}
          withPictogram
          fileName="Запуски скважин"
          fileExtension={starts}
          size='xs'
        />}
    </FileField>
    <FileField  id="FileFieldWithText2" onChange={() => {
      importStops()
      //setFile(e.target.files[0]?.name)
    }}>
      {(props) => <Attachment {...props} style={{ width: 138, marginRight: -8 }}
        withPictogram
        fileName="Остановки скважин"
        fileExtension={stops}
        size='xs'
      />}
    </FileField>
    <FileField  id="FileFieldWithText3" onChange={() => {
      importRgd()
      //setFile(e.target.files[0]?.name)
    }}>
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