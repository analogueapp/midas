import React from "react"

import './KeyboardShortcut.scss'

interface Props {
  text: string
  color?: string
  keys: [string]
}

const KeyboardShortcut = (props: Props) => {
  const mac = window.navigator.platform.includes("Mac")

  return (
    <label className="keyboardShorcut">
      {props.keys.map(key =>
        <code
          key={key}
          style={{ background: props.color ? props.color : "#2a2a2a" }}
        >
          {key === "CMD" ? mac ? "⌘" : "⌃" : key}
        </code>
      )}
      <span>{props.text}</span>
    </label>
  )
}

export default KeyboardShortcut
