import React, { useState, useRef, useEffect } from 'react';
import { Input } from 'antd';

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
    console.log("SHOW INPUT CHANGED")
    if (_input.current && showInput) {
      _input.current.input.focus()
    }
  }, [showInput, props.showParent])

  const onChange = (e) => {
    const value = e.clear ? "" : e.target.value
    setInputValue(value)
  }

  const onPressEnter = () => console.log("enter press", inputValue)

  return (
    <div className="primerCreate">
      {showInput &&
        <Input
          allowClear
          ref={_input}
          value={inputValue}
          onChange={onChange}
          onPressEnter={onPressEnter}
          placeholder="Name your collection"
        />
      }
    </div>
  )
}

export default PrimerCreate
