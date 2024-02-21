import React  from 'react'
import { DatePicker } from '@consta/uikit/DatePicker'
import { Button } from '@consta/uikit/Button'
import { Select } from '@consta/uikit/Select'
import useStore, {StoreType} from '../../store'

const Header: React.FC = () => {
  const month = useStore((state : StoreType) => state.month)
  const setMonth = useStore((state : StoreType) => state.setMonth)

  const ngpd = useStore((state : StoreType) => state.ngpd)
  const setNgpd = useStore((state : StoreType) => state.setNgpd)
  
  const chart = useStore((state : StoreType) => state.chart)
  const changeChart = useStore((state : StoreType) => state.changeChart)

  return (<div style={{
    display: 'flex', 
    flexDirection: 'row', 
    width: '100%', 
    justifyContent: 'space-between',
    alignItems: 'center', 
    paddingLeft: 92 
  }}>
    <div >
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
    <div style={{display: 'flex', flexDirection: 'row' }}>
      <Select
        placeholder="Выберите значение"
        items={[
          { label: 'Без НГПД', id: 'no' },
          { label: 'НГПД', id: 'yes' },
          { label: 'Все', id: 'all' },
        ]}
        value={ngpd}
        onChange={setNgpd}
        style={{ margin: 20, width: 100, marginLeft:0  }} 
        size="xs"
      />
      <Button 
        label="Таблица" 
        size="xs" 
        style={{ margin: 20, marginLeft:0, marginRight: 10 }} 
        view={chart ? 'secondary' : 'primary'} 
        onClick={changeChart}
      />
      <Button 
        label="Графики"
        size="xs"
        style={{ margin: 20, marginLeft: 0 }}
        view={!chart ? 'secondary' : 'primary'}
        onClick={changeChart}
      />
    </div>
  </div>)
}

export default Header