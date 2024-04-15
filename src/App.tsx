import React from 'react'
import './App.css'
import useStore, {StoreType} from './store'
import { Theme, presetGpnDefault } from '@consta/uikit/Theme'
import { Layout } from '@consta/uikit/Layout'
import Table from './components/Table'
import Header from './components/Header'
import Charts from './components/Charts'
import Report from './components/Report'
import MultiSelect from './components/MultiSelect'

const renderSwitch = (tab) => {
  switch(tab) {
  case 'table':
    return <Table/>
  case 'chart':
    return <Charts/>
  case 'report':
    return <Report/>
  }
}

// парсинг (преобразовании данных из Excel в данные для веб-системы) и отображению этих данных
// Частично эта задача, насколько понимаю, может решаться вместе с предыдущей
// Расчёты полученных данных частично реализованы. Без учёта расчётов, относящихся к разделу доклад
// С данными из АПД и данными из Excel для "плана" уже работал, но, с учётом неопределённости на текущий момент способа интеграции со смежными системами

function App() {
  const tab = useStore((state : StoreType) => state.tab)
  const filter = useStore((state : StoreType) => state.filter)

  return (
    <Theme preset={presetGpnDefault} style={{height: '100%'}}>
      <Layout style={{  height: '100%'}} direction="row">
        <Layout flex={filter ? 1 : 0} style={{height: '100%', background: '#dfedf6'}}>
          {filter && <MultiSelect />}
        </Layout>

        <Layout flex={7} style={{  height: '100%'}} direction="column">
          <Layout flex={1} style={{background: '#ecf1f4', width: '100%', flex: 1, alignItems: 'center' }}>
            <Header />
          </Layout>
          <Layout flex={13} style={{ width: '100%' }}>
            {renderSwitch(tab)}
          </Layout>
        </Layout>
      </Layout>
    </Theme>
  )
}

export default App
