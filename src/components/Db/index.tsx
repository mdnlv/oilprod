import React from 'react'
import { IconFolderOpen } from '@consta/icons/IconFolderOpen'
import { IconSave } from '@consta/icons/IconSave'
import { Button } from '@consta/uikit/Button'
import useStore, { StoreType } from '../../store'

const Db: React.FC = () => {
  const changeOpenModal = useStore((state : StoreType) => state.changeOpenModal)
  const changeSaveModal = useStore((state : StoreType) => state.changeSaveModal)

  return (<div style={{
    display: 'flex', 
    flexDirection: 'row', 
    width: '100%', 
    justifyContent: 'space-between',
    alignItems: 'center',
  }}>
    <Button label="Фильтр" view="ghost" iconRight={IconFolderOpen} onlyIcon size="s" onClick={()=>{changeOpenModal()}} style={{
      marginRight: 8
    }}/>
    <Button label="Фильтр" view="ghost" iconRight={IconSave} onlyIcon size="s" onClick={()=>{changeSaveModal()}}/>
  </div>)
}

export default Db