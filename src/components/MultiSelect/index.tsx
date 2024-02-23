import React from 'react'
import { CheckboxGroup } from '@consta/uikit/CheckboxGroup'
import { places } from '../../constants'


const MultiSelect: React.FC = () => {
  return (<div style={{flexDirection: 'column'}}>{
    places.map(item => <div key={item.id} style={{flexDirection: 'column'}}>
      <CheckboxGroup
        items={item.wells}
        getItemLabel={(i) => i.name}
        name={'CheckboxGroup'}
      />
    </div> 
    )}
  </div>)
}

export default MultiSelect