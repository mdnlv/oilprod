import React  from 'react'
import { DatePicker } from '@consta/uikit/DatePicker'
import { Button } from '@consta/uikit/Button'
import useStore, {StoreType} from '../../store'

const Header: React.FC = () => {
  const month = useStore((state : StoreType) => state.month)
  const setMonth = useStore((state : StoreType) => state.setMonth)
  
  return (<div style={{display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-between', paddingLeft: 92 }}>
    <div>
      <span>Данные графика и прогноза добычи за</span>
      <DatePicker
        style={{  width: 64, margin: 10, marginLeft: 4 }} 
        type="month"
        value={month}
        onChange={setMonth}
        size="xs"
        form="brick"
      />
    </div>
    <div >
      <Button label="Графики" size="xs"/>
      <Button label="Фильтры" size="xs" style={{ margin: 10 }} view="ghost"/>
      <Button label="Сохранить" size="xs" style={{ margin: 10 }} view="secondary"/>
    </div>
  </div>)
}

export default Header