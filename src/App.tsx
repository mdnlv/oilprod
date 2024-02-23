import React from 'react'
import './App.css'
import useStore, {StoreType} from './store'
import { Theme, presetGpnDefault } from '@consta/uikit/Theme'
import { Layout } from '@consta/uikit/Layout'

import Table from './components/Table'
import Header from './components/Header'
import Charts from './components/Charts'
import MultiSelect from './components/MultiSelect'

function App() {
  const chart = useStore((state : StoreType) => state.chart)
  return (
    <Theme preset={presetGpnDefault} style={{height: '100%'}}>
      <Layout style={{  height: '100%'}} direction="row">
        <Layout flex={1} style={{  height: '100%'}}>
          <MultiSelect />
        </Layout>
        <Layout flex={6} style={{  height: '100%'}} direction="column">
          <Layout flex={1} style={{background: '#ecf1f4', width: '100%', flex: 1, alignItems: 'center' }}>
            <Header />
          </Layout>
          <Layout flex={10} style={{ width: '100%' }}>
            {chart ? <Charts/> :<Table />}
          </Layout>
        </Layout>
      </Layout>
    </Theme>
  )
}

export default App
