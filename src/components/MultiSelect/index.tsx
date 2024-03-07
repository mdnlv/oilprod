import React from 'react'
import { Checkbox } from '@consta/uikit/Checkbox'
import { useStore, PlacesStoreType } from '../../store/places'
import { Layout } from '@consta/uikit/Layout'
import { IconArrowDown } from '@consta/icons/IconArrowDown'
import { IconArrowUp } from '@consta/icons/IconArrowUp'

const MultiSelect: React.FC = () => {
  const places = useStore((state : PlacesStoreType) => state.places)
  const setFilterHeader = useStore((state : PlacesStoreType) => state.setFilterHeader)
  const setFilter = useStore((state : PlacesStoreType) => state.setFilter)
  const changeFilterOpen = useStore((state : PlacesStoreType) => state.changeFilterOpen)


  const headerItemClick = (id) => setFilterHeader(id)
  const headerItemOpen = (id) => changeFilterOpen(id)
  const itemClick = (headerId, id) => setFilter(headerId, id)

  return (
    <Layout flex={7} style={{ height: '100%', borderRight: '2px solid #bacada'}} direction="column">
      <Layout direction="column" style={{ marginTop: 22, paddingLeft: 18, paddingRight: 16}}>
        {places.map(item => 
          <div key={item.id} style={{flexDirection: 'column', marginBottom: 12}}>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}} onClick={()=>{}}>
              <Checkbox 
                label={item.name} 
                checked={item.select} 
                style={{marginBottom: 6, color: '#eee'}} 
                size="xs" 
                onChange={()=>headerItemClick(item.id)}
              />
              {item.open ?
                <div style={{cursor: 'pointer'}}><IconArrowUp size='xs' onClick={()=>headerItemOpen(item.id)}/></div> :
                <div style={{cursor: 'pointer'}}><IconArrowDown size='xs' onClick={()=>headerItemOpen(item.id)}/></div>
              }
            </div>
            {item.open && <div style={{display: 'flex', flexDirection: 'column', paddingLeft: 20}}>
              {item.wells.map(el => <Checkbox 
                key={item.id+'-'+el.id}
                label={el.name} 
                checked={el.select} 
                style={{marginBottom: 6, color: '#eee'}} 
                size="xs" 
                onChange={()=>itemClick(item.id, el.id)}
              />)}
            </div>}
          </div> 
        )}
      </Layout>
    </Layout>
  )
}

export default MultiSelect