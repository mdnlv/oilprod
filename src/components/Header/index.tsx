import React  from 'react'
import { MobileMenu } from '@consta/header/MobileMenu'
import { DatePicker } from '@consta/uikit/DatePicker'
import { useState } from 'react'

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
  const [value, setValue] = useState<Date | null>(null)
  
  return (<>
    <MobileMenu items={items_mobile} style={{marginRight: 10}}/>
    <span>Данные графика и прогноза добычи за </span>
    <DatePicker
      style={{  width: 100, marginLeft: 10 }} 
      type="month"
      value={value}
      onChange={setValue}
    />
    {/*<h1>{bears} around here...</h1><button onClick={increasePopulation}>one up</button>*/}
  </>)
}

export default Header