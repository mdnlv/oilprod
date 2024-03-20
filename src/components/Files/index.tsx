import React, { useEffect, useState }  from 'react'
//import useStore, {StoreType} from '../../store'
import { Button } from '@consta/uikit/Button'
import { FileField } from '@consta/uikit/FileField'
import { read } from 'xlsx'

function getKeyByValue(object, value) {
  return Object.keys(object).filter(key => object[key].v === value)
}

const Files: React.FC = () => {
  // const month = useStore((state : StoreType) => state.month)
  // const setMonth = useStore((state : StoreType) => state.setMonth)

  const [file, setFile] = useState()
  // const [workbook, setWorkbook] = useState([])

  useEffect(() => {
    (async() =>{
      const url = 'http://localhost:3000/start.xls'
      const file = await (await fetch(url)).arrayBuffer()
      const wb = read(file)
      const keys = getKeyByValue(wb.Sheets?.report, 'Ввод новых ГС с МГРП')
      const fact = keys.map(item => ({
        date: wb.Sheets?.report['F'+item.slice(1)].w,
        name: wb.Sheets?.report['G'+item.slice(1)].w,
        shortName: wb.Sheets?.report['H'+item.slice(1)].w, 
        oil: 11
      }))
      console.log(fact)

      console.log(wb.Sheets?.report)
      console.log(getKeyByValue(wb.Sheets?.report, 'Ввод новых ГС с МГРП'))

      //setWorkbook(wb)
    })() 
  }, [])
  

  return (<div style={{
    display: 'flex', 
    flexDirection: 'row', 
    width: '100%', 
    justifyContent: 'space-between',
    alignItems: 'center',
  }}>
    <FileField  id="FileFieldWithText" style={{ width: 200 }} onChange={(e) => {
    
      setFile(e.target.files[0]?.name)
    }}>
      {(props) => <Button {...props} size="xs" label="Запуски скважин" view='ghost'/>}
    </FileField>
  </div>)
}

export default Files