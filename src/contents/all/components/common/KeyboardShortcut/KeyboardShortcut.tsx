import React from "react"

import './KeyboardShortcut.scss'

const mac = window.navigator.platform.includes("Mac")

const keyMap = (key) => {
  switch(key) {
    case "CMD":
      return mac ? "⌘" : "⌃"
    case "ENTER":
      return mac ? "return" : "Enter"
    case "ESC":
      return mac ? "esc" : "Esc"
    default:
      return key
  }
}

interface Props {
  text: string
  className?: string
  vertical?: boolean
  keys: [string]
}

const KeyboardShortcut = (props: Props) => {

  return (
    <label className={`keyboardShorcut ${props.className ? props.className : ""} ${props.vertical ? "column" : ""}`}>
      {props.keys.map(key =>
        <code
          key={key}
          className={key === "CMD" ? "cmd" : ""}
        >
          {keyMap(key)}
        </code>
      )}
      <span>{props.text}</span>
    </label>
  )
}

export default KeyboardShortcut
