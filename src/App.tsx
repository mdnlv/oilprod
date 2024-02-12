import React from 'react'
import './App.css'

import { Theme, presetGpnDefault } from '@consta/uikit/Theme'
import { Layout } from '@consta/uikit/Layout'

import Table from './components/Table'
import Header from './components/Header'

function App() {
  return (
    <Theme preset={presetGpnDefault} style={{height: '100%'}}>
      <Layout flex={1} style={{background: '#ecf1f4', height: '5%', width: '100%', flex: 1, alignItems: 'center', paddingLeft: 10, }}>
        <Header />
      </Layout>
      <Layout flex={1} style={{  height: '95%', width: '100%' }}>
        <Table />
      </Layout>
    </Theme>
  )
}

export default App
