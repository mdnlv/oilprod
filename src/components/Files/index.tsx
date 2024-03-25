import React, { useEffect }  from 'react'
//import useStore, {StoreType} from '../../store'
import { FileField } from '@consta/uikit/FileField'
import { read } from 'xlsx'
import useDataStore, { DataStoreType } from '../../store/data'
import { Attachment } from '@consta/uikit/Attachment'

function getKeyByValue(object, value) {
  // console.log(object, value)
  return Object.keys(object).filter(key => (object[key].v + '').indexOf(value) > -1)
}

const Files: React.FC = () => {
  // const month = useStore((state : StoreType) => state.month)
  // const setMonth = useStore((state : StoreType) => state.setMonth)

  const setFactItems = useDataStore((state : DataStoreType) => state.setFactItems)

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
  
  useEffect(() => {
    (async() =>{
      const url = 'http://localhost:3000/start.xls'
      const file = await (await fetch(url)).arrayBuffer()
      const wb = read(file)
      const keys = getKeyByValue(wb.Sheets?.report, 'Ввод новых')
      const fact = keys.map(item => ({
        date: wb.Sheets?.report['F'+item.slice(1)].w.substr(0, 2),
        name: wb.Sheets?.report['G'+item.slice(1)].w,
        shortName: wb.Sheets?.report['H'+item.slice(1)].w, 
        oil: wb.Sheets?.report['U'+item.slice(1)].w
      }))
      // console.log(fact)
      setFactItems(fact)
      // console.log(wb.Sheets?.report)
      // console.log(getKeyByValue(wb.Sheets?.report, 'Ввод новых ГС с МГРП'))

      //setWorkbook(wb)
    })() 
  }, [])  

  const one = () => {
    (async() =>{
      const url = 'http://localhost:3000/start.xls'
      const file = await (await fetch(url)).arrayBuffer()
      const wb = read(file)
      const keys = getKeyByValue(wb.Sheets?.report, 'Ввод новых')
      const fact = keys.map(item => ({
        date: wb.Sheets?.report['F'+item.slice(1)].w.substr(0, 2),
        name: wb.Sheets?.report['G'+item.slice(1)].w,
        shortName: wb.Sheets?.report['H'+item.slice(1)].w, 
        oil: wb.Sheets?.report['U'+item.slice(1)].w
      }))
      // console.log(fact)
      setFactItems(fact)
      // console.log(wb.Sheets?.report)
      // console.log(getKeyByValue(wb.Sheets?.report, 'Ввод новых ГС с МГРП'))

      //setWorkbook(wb)
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
      one()
      //setFile(e.target.files[0]?.name)
    }}>
      {(props) =>       
        <Attachment {...props} style={{ width: 138, marginRight: -8 }}
          withPictogram
          fileName="Запуски скважин"
          fileExtension="xls"
          size='xs'
        />}
    </FileField>
    <FileField  id="FileFieldWithText2" onChange={() => {
      one()
      //setFile(e.target.files[0]?.name)
    }}>
      {(props) => <Attachment {...props} style={{ width: 138, marginRight: -8 }}
        withPictogram
        fileName="Остановки скважин"
        fileExtension="x"
        size='xs'
      />}
    </FileField>
    <FileField  id="FileFieldWithText3" onChange={() => {
      one()
      //setFile(e.target.files[0]?.name)
    }}>
      {(props) => <Attachment {...props} style={{ width: 138, marginRight: -8 }}
        withPictogram
        fileName="Расчёт графика добычи"
        fileExtension="x"
        size='xs'
      />}
    </FileField>
  </div>)
}

export default Files