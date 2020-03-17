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
  color?: string
  keys: [string]
}

const KeyboardShortcut = (props: Props) => {

  return (
    <label className="keyboardShorcut">
      {props.keys.map(key =>
        <code
          key={key}
          className={key === "CMD" ? "cmd" : ""}
          style={{ background: props.color ? props.color : "#2a2a2a" }}
        >
          {keyMap(key)}
        </code>
      )}
      <span>{props.text}</span>
    </label>
  )
}

export default KeyboardShortcut
