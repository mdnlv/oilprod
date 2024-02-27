import React from 'react'
import { Checkbox } from '@consta/uikit/Checkbox'
import { CheckboxGroup } from '@consta/uikit/CheckboxGroup'
import { useStore, PlacesStoreType } from '../../store/places'
import { Layout } from '@consta/uikit/Layout'

const MultiSelect: React.FC = () => {
  const places = useStore((state : PlacesStoreType) => state.places)
  const setFilterHeader = useStore((state : PlacesStoreType) => state.setFilterHeader)

  const headerItemClick = (id) => setFilterHeader(id)
  // const itemClick = () => {}

  return (
    <Layout flex={7} style={{ height: '100%', borderRight: '2px solid #dfedf6'}} direction="column">
      <Layout flex={1} style={{alignItems: 'center', paddingLeft: 16}}>
        Месторождения
      </Layout> 
      <Layout flex={13} direction="column" style={{ paddingLeft: 16, paddingRight: 16}}>
        {places.map(item => 
          <div key={item.id} style={{flexDirection: 'column', marginBottom: 24}}>
            <Checkbox 
              label={item.name} 
              checked={item.select} 
              style={{marginBottom: 12, color: '#eee'}} 
              size="s" 
              onChange={()=>headerItemClick(item.id)}
            />
            <CheckboxGroup
              items={item.wells}
              getItemLabel={(i) => i.name}
              name={'CheckboxGroup'}
              style={{paddingLeft: 16}}
              size="s"
            />
          </div> 
        )}
      </Layout>
    </Layout>
  )
}

export default MultiSelect