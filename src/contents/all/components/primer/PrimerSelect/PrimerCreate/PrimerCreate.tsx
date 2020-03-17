/*global chrome*/

import React, { useState, useRef, useEffect } from 'react';
import { Input } from 'antd';

import KeyboardShortcut from '../../../common/KeyboardShortcut/KeyboardShortcut'

import { PlusOutlined } from '@ant-design/icons';

import './PrimerCreate.scss';

interface Props {
  defaultShowInput?: boolean
  showParent: boolean
  toggleShowParent: () => void
}

const PrimerCreate = (props: Props) => {

  const [inputValue, setInputValue] = useState("")
  const [showInput, setShowInput] = useState(props.defaultShowInput)

  const _input = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // focus input on show
    if (showInput && props.showParent) {
      if (_input.current) {
        _input.current.input.focus()
      }
    } else {
      // reset input value on hide parent or input
      setInputValue("")
      if (_input.current) {
        _input.current.input.blur()
      }
    }
  }, [showInput, props.showParent])

  const onChange = (e) => {
    const value = e.clear ? "" : e.target.value
    setInputValue(value)
  }

  const hideParentAndReset = () => {
    props.toggleShowParent()
    setShowInput(false)
  }

  const handleInputClose = () => {
    if (props.defaultShowInput) {
      props.toggleShowParent()
    } else {
      setShowInput(false)
    }
  }

  const onPressEnter = () => {
    chrome.runtime.sendMessage({
      message: "create_primer",
      title: inputValue,
    })
    setShowInput(false)
  }

  const onKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleInputClose()
    }
  }

  return (
    <div className={`primerCreate ${inputValue.length > 2 ? "show" : ""}`}>
      {showInput
        ? (
          <>
            <Input
              allowClear
              ref={_input}
              value={inputValue}
              onChange={onChange}
              onPressEnter={onPressEnter}
              onKeyDown={onKeyDown}
              placeholder="Name your collection"
            />
            <KeyboardShortcut onClick={onPressEnter} className="fadeIn" text="Create" keys={['ENTER']} />
            <KeyboardShortcut onClick={handleInputClose} text="Cancel" keys={['ESC']} />
          </>
        )
        : (
          <>
            <div className="createBtn" onClick={() => setShowInput(true)}>
              <PlusOutlined /> New Collection
            </div>
            <span className="doneBtn" onClick={props.toggleShowParent}>Done</span>
          </>
        )
      }
    </div>
  )
}

export default PrimerCreate
