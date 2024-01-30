import React from 'react'
import './App.css'

import { Theme, presetGpnDefault } from '@consta/uikit/Theme'
import { Text } from '@consta/uikit/Text'
import { Layout } from '@consta/uikit/Layout'

import Table from './components/Table'
import moment from 'moment'

/*
const rowData: Array<object>  = [
  { user: 'Крокодил Гена', role: 'администратор', priority: '1' },
  { user: 'Чебурашка', role: 'читатель', priority: '2' },
  { user: 'Шапокляк', role: 'вредитель', priority: '777' },
]*/
  
const columnDefs: Array<object> = [
  { field: 'day', headerName: 'День' },
  { field: 'user', headerName: 'Пользователь' },
  { field: 'role', headerName: 'Роль' },
  { field: 'priority', headerName: 'Приоритет' },
]

const days = moment().daysInMonth()

function App() {

  const a = [...Array(days)].map((_, i) => {return { day: i+1, user: 'Чебурашка', role: 'читатель', priority: i }})
  return (
    <Theme preset={presetGpnDefault}>
      <Layout flex={1} style={{background: '#289090'}}>
        <Text view="primary" size="m" lineHeight="m">
          Это первый блок
        </Text>
      </Layout>
      <Layout flex={2} style={{ height: '699px', width: '100%' }}>
        <Table rowData={a} columnDefs={columnDefs} />
      </Layout>
    </Theme>
  )
}

export default App
