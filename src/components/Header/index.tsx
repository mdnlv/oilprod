import React  from 'react'
import { DatePicker } from '@consta/uikit/DatePicker'
import { Button } from '@consta/uikit/Button'
import { Select } from '@consta/uikit/Select'
import useStore, {StoreType} from '../../store'
import { FieldGroup } from '@consta/uikit/FieldGroup'
import { IconFilter } from '@consta/icons/IconFilter'
import { Text } from '@consta/uikit/Text'
import Files from '../Files'

const Header: React.FC = () => {
  const month = useStore((state : StoreType) => state.month)
  const setMonth = useStore((state : StoreType) => state.setMonth)

  const ngpd = useStore((state : StoreType) => state.ngpd)
  const setNgpd = useStore((state : StoreType) => state.setNgpd)
  
  const tab = useStore((state : StoreType) => state.tab)
  const changeTab = useStore((state : StoreType) => state.changeTab)

  // const filter = useStore((state : StoreType) => state.filter)
  const changeFilter = useStore((state : StoreType) => state.changeFilter)

  return (<div style={{
    display: 'flex', 
    flexDirection: 'row', 
    width: '100%', 
    justifyContent: 'space-between',
    alignItems: 'center',
  }}>
    <div style={{display: 'flex', flexDirection: 'row'}}>
      <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginRight: 40}}>
        <div style={{width: 84, textAlign: 'center'}}>
          <Button label="Фильтр" view="ghost" iconRight={IconFilter} onlyIcon size="s" onClick={changeFilter}/>
        </div>
        <Text size="s">Данные графика и прогноза добычи за:</Text>
        <DatePicker
          style={{width: 63, margin: 10, marginLeft: 4 }} 
          type="month"
          value={month}
          onChange={setMonth}
          size="xs"
          form="brick"
        />
      </div>
    </div>
    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
      <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
        <Files />
      </div>
      <Select
        placeholder="Выберите значение"
        items={[
          { label: 'Без НГПД', id: 'no' },
          { label: 'НГПД', id: 'yes' },
          { label: 'Все', id: 'all' },
        ]}
        value={ngpd}
        onChange={setNgpd}
        style={{ width: 150, marginRight: 10,  marginLeft: 60}} 
        size="xs"
      />

      <FieldGroup size="xs" style={{ marginRight: 10  }}>
        <Button 
          label="Таблица" 
          size="xs" 
          style={{ marginLeft:0}} 
          view={tab === 'table' ? 'secondary' : 'primary'} 
          onClick={()=>changeTab('table')}
        />
        <Button 
          label="Доклад" 
          size="xs" 
          style={{ marginLeft:0}} 
          view={tab === 'report' ? 'secondary' : 'primary'} 
          onClick={()=>changeTab('report')}
        />
        <Button 
          label="Графики"
          size="xs"
          style={{ marginLeft: 0 }}
          view={tab === 'chart' ? 'secondary' : 'primary'}
          onClick={()=>changeTab('chart')}
        />
      </FieldGroup>
    </div>
  </div>)
}

export default Header