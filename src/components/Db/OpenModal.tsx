import React from 'react'
import { Button } from '@consta/uikit/Button'
import useStore, { StoreType } from '../../store'
import { Modal } from '@consta/uikit/Modal'
import { Text } from '@consta/uikit/Text'

const OpenModal: React.FC = () => {
  const changeOpenModal = useStore((state : StoreType) => state.changeOpenModal)
  const openModal = useStore((state : StoreType) => state.openModal)

  return (
    <Modal
      isOpen={openModal}
      hasOverlay
      onClickOutside={() => changeOpenModal()}
      onEsc={() => changeOpenModal()}
      style={{padding: 10, flex: 1, flexDirection: 'column', justifyContent: 'space-between'}}
    >
      <div><Text as="p" size="l" view="brand" lineHeight='l'>
        Выберите запись 
      </Text></div>
      <div style={{flexDirection:'column', flex: 1, marginTop: 8}}>
        {[1,2,3].map((item, i) => <div key={i} style={{marginBottom: 4}}>
          <Button
            size='xs'
            view="ghost"
            label={`Март 2024 | Запись ${item} от 22.03.2024`}
            width="default"
            onClick={() => changeOpenModal()}
          />
        </div>)}
      </div>
    </Modal>)
}

export default OpenModal