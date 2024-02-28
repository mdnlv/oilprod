import { useState, useRef } from 'react'
import React from 'react'
import Tippy from '@tippyjs/react'
const PopupCellRenderer = (props) => {
  const tippyRef = useRef()
  const [visible, setVisible] = useState(false)
  const show = () => setVisible(true)
  const hide = () => setVisible(false)

  const dropDownContent = (
    <div className="menu-container">
      <div onClick={() => onClickHandler('create')} className="menu-item">
        Create New Row
      </div>
      <div className="menu-item">
        <input></input>
      </div>
      <div onClick={() => onClickHandler('delete')} className="menu-item">
        Delete Row
      </div>
    </div>
  )

  const onClickHandler = (option) => {
    hide()
    if (option === 'create') {
      props.api.applyTransaction({
        add: [{}],
      })
    }
    if (option === 'delete') {
      props.api.applyTransaction({ remove: [props.data] })
    }

    if (option === 'edit') {
      props.api.startEditingCell({
        rowIndex: props.rowIndex,
        colKey: 'make',
      })
    }
  }

  return (
    <Tippy
      ref={tippyRef}
      content={dropDownContent}
      visible={visible}
      onClickOutside={hide}
      allowHTML={true}
      arrow={false}
      appendTo={document.body}
      interactive={true}
      placement="right"
    >
      <button className="btn btn-primary" onClick={visible ? hide : show}>
        Action
      </button>
    </Tippy>
  )
}

export default PopupCellRenderer
