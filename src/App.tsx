import React from 'react'
import './App.css'
import useStore, {StoreType} from './store'
import { Theme, presetGpnDefault } from '@consta/uikit/Theme'
import { Layout } from '@consta/uikit/Layout'

import Table from './components/Table'
import Header from './components/Header'
import Charts from './components/Charts'

function App() {
  const chart = useStore((state : StoreType) => state.chart)
  return (
    <Theme preset={presetGpnDefault} style={{height: '100%'}}>
      <Layout flex={1} style={{background: '#ecf1f4', height: '5%', width: '100%', flex: 1, alignItems: 'center' }}>
        <Header />
      </Layout>
      <Layout flex={1} style={{  height: '95%', width: '100%' }}>
        {chart ? <Charts/> :<Table />}
      </Layout>
    </Theme>
  )
}

export default App
