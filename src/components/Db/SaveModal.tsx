import React from 'react'
import { Button } from '@consta/uikit/Button'
import useStore, { StoreType } from '../../store'
import { Modal } from '@consta/uikit/Modal'
import { Text } from '@consta/uikit/Text'
import moment from 'moment'
import { Layout } from '@consta/uikit/Layout'

const SaveModal: React.FC = () => {
  const changeSaveModal = useStore((state : StoreType) => state.changeSaveModal)
  const saveModal = useStore((state : StoreType) => state.saveModal)
  const month = useStore((state : StoreType) => state.month)

  return (
    <Modal
      isOpen={saveModal}
      hasOverlay
      onClickOutside={() => changeSaveModal()}
      onEsc={() => changeSaveModal()}
      style={{padding: 10, flex: 1, flexDirection: 'column', alignItems:'center'}}
    >
      <div><Text as="p" size="l" view="brand" lineHeight="l">
      Параметры записи 
      </Text></div>
      <div style={{flexDirection:'column', flex: 1, marginTop: 8, marginBottom: 18, justifyContent: 'space-between'}}>
        <Layout style={{  height: '100%'}} direction="row">
          <Text as="p" size="s" view="secondary" lineHeight="m">
          Месяц: 
          </Text>        
          <Text as="p" size="s" view="secondary" lineHeight="m" style={{marginLeft: 4 }} >{moment(month).format('MM.YYYY')}</Text>
        </Layout>
        <Layout style={{  height: '100%'}} direction="row">
          <Text as="p" size="s" view="secondary" lineHeight="m">Название: </Text>

          <input style={{width: 120, marginLeft: 4 }} />
        </Layout>
        <Layout style={{  height: '100%'}} direction="row">
          <Text as="p" size="s" view="secondary" lineHeight="m">Дата создания: </Text>
          <Text as="p" size="s" view="secondary" lineHeight="m" style={{marginLeft: 4 }} >{moment(Date.now()).format('DD.MM.YYYY HH:mm')}</Text>
        </Layout>
      </div>
      <div style={{textAlign: 'center'}}><Button
        size="s"
        view='primary'
        label='Сохранить'
        width="default"
        onClick={() => changeSaveModal()}
      /></div>
    </Modal>)
}

export default SaveModal