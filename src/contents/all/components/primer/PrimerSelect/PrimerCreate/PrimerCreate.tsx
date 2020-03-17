import React, { useState, useRef, useEffect } from 'react';
import { Input } from 'antd';

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
    // TODO load primers from API on mount
  }, [])

  useEffect(() => {
    // focus input on show
    if (showInput && props.showParent) {
      if (_input.current) {
        _input.current.input.focus()
      }
    } else {
      // reset input value on hide parent or input
      setInputValue("")
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

  const onPressEnter = () => console.log("enter press", inputValue)

  const onKeyDown = (e) => {
    if (e.key === 'Escape') {
      if (props.defaultShowInput) {
        props.toggleShowParent()
      } else {
        setShowInput(false)
      }
    }
  }

  return (
    <div className="primerCreate">
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
          </>
        )
        : (
          <div className="">
            <PlusOutlined /> New Collection
          </div>
        )
      }
    </div>
  )
}

export default PrimerCreate
