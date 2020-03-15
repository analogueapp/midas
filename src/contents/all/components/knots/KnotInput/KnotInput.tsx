import React, { useState, useRef, useEffect } from 'react';
import { Timeline } from "antd";
import RichTextEditor from 'react-rte/lib/RichTextEditor';

import "../Knot/Knot.scss"
import "./KnotInput.scss";

const KnotInput = props => {

  const platform = window.navigator.platform.includes("Mac")

  const knotEditor = useRef<HTMLInputElement>(null)
  const [body, setBody] = useState(RichTextEditor.createEmptyValue())
  const [showFooter, setShowFooter] = useState(false)

  useEffect(() => {
    const targetIsRef = knotEditor.hasOwnProperty("current")
    const currentTarget = targetIsRef ? knotEditor.current : knotEditor;
    if (currentTarget)
      currentTarget.addEventListener("keydown", onKeyDown)
    return () => {
      if (currentTarget)
        currentTarget.removeEventListener("keydown", onKeyDown)
    };
  }, [])

  const onKeyDown = (e) => {
    if (e.key == "Enter" && (e.metaKey || e.ctrlKey)) {
      console.log("cmd enter")
      e.preventDefault()
      e.stopPropagation()
    }
  }

  const onChange = (value) => {
    setBody(value)
    if (value.toString("markdown").length >= 3) {
      if (!showFooter) setShowFooter(true)
    } else {
      setShowFooter(false)
    }
  }

  return (
    <Timeline.Item className={`knot ${props.hasKnots ? "" : "ant-timeline-item-last"}`}>
      <div className="knotCard">
        <div className="knotEditorWrapper">
          <div className="knotEditor" ref={knotEditor}>
            {props.show &&
              <RichTextEditor
                autoFocus
                toolbarConfig={{ display: [] }}
                value={body}
                onChange={onChange}
                placeholder={props.hasKnots ? "Add another note..." : "Add a note..."}
              />
            }
          </div>
        </div>
      </div>
      <div className={`knotCardFooter ${showFooter ? "show" : "hide"}`}>
        <p><code>{platform ? "⌘" : "⌃"}</code><code>Enter</code><span>to save</span></p>
      </div>
    </Timeline.Item>
  )
}

export default KnotInput;
