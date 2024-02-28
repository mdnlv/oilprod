import React from 'react'
import { Checkbox } from '@consta/uikit/Checkbox'
import { useStore, PlacesStoreType } from '../../store/places'
import { Layout } from '@consta/uikit/Layout'

const MultiSelect: React.FC = () => {
  const places = useStore((state : PlacesStoreType) => state.places)
  const setFilterHeader = useStore((state : PlacesStoreType) => state.setFilterHeader)
  const setFilter = useStore((state : PlacesStoreType) => state.setFilter)


  const headerItemClick = (id) => setFilterHeader(id)
  const itemClick = (headerId, id) => setFilter(headerId, id)

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
            <div style={{paddingLeft: 16}}>
              {item.wells.map(el => <Checkbox 
                key={item.id+'-'+el.id}
                label={el.name} 
                checked={el.select} 
                style={{marginBottom: 12, color: '#eee'}} 
                size="s" 
                onChange={()=>itemClick(item.id, el.id)}
              />)}
            </div>
          </div> 
        )}
      </Layout>
    </Layout>
  )
}

export default MultiSelect