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
    <Layout flex={7} style={{ height: '100%', borderRight: '2px solid #bacada'}} direction="column">
      <Layout direction="column" style={{ marginTop: 22, paddingLeft: 18, paddingRight: 16}}>
        {places.map(item => 
          <div key={item.id} style={{flexDirection: 'column', marginBottom: 18}}>
            <Checkbox 
              label={item.name} 
              checked={item.select} 
              style={{marginBottom: 4, color: '#eee'}} 
              size="xs" 
              onChange={()=>headerItemClick(item.id)}
            />
            <div style={{flexDirection: 'column', paddingLeft: 20}}>
              {item.wells.map(el => <Checkbox 
                key={item.id+'-'+el.id}
                label={el.name} 
                checked={el.select} 
                style={{marginBottom: 4, color: '#eee'}} 
                size="xs" 
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