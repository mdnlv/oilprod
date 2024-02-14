import React  from 'react'
import { MobileMenu } from '@consta/header/MobileMenu'
import { DatePicker } from '@consta/uikit/DatePicker'
import useStore, {StoreType} from '../../store'

const items_mobile = [
  {
    label: 'Сохранить',
    onClick: (e) => {
      e.preventDefault()
    }
  },
  { label: 'Обновить' },
]

const Header: React.FC = () => {
  const month = useStore((state : StoreType) => state.month)
  const setMonth = useStore((state : StoreType) => state.setMonth)
  
  return (<>
    <MobileMenu items={items_mobile} style={{marginRight: 10}}/>
    <span>Данные графика и прогноза добычи за </span>
    <DatePicker
      style={{  width: 100, marginLeft: 10 }} 
      type="month"
      value={month}
      onChange={setMonth}
    />
  </>)
}

export default Header