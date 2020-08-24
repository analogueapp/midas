import React, { useState, useRef, useEffect } from 'react';
import { Timeline } from "antd";
import RichTextEditor from 'react-rte/lib/RichTextEditor';

import KeyboardShortcut from '../../common/KeyboardShortcut/KeyboardShortcut';
import { Response as ResponseType } from '../../../global/types';

import "./ResponseInput.scss";
import './ResponseForm.scss';

interface Props {
  response?: ResponseType
  className?: string
  parentId?: number
  respondableId?: number
  editResponse?: () => void
  onClose?: () => void
  first?: boolean
}

const ResponseInput = ({
  response,
  className,
  parentId,
  respondableId,
  editResponse,
  onClose,
  first
}: Props) => {

  const knotEditor = useRef(null)

  const [submit, setSubmit] = useState(false)
  const [showFooter, setShowFooter] = useState(false)
  const [body, setBody] = useState(response ? RichTextEditor.createValueFromString(response.body, 'html') : RichTextEditor.createEmptyValue())

  useEffect(() => {
    const targetIsRef = knotEditor.hasOwnProperty("current")
    const currentTarget = targetIsRef ? knotEditor.current : knotEditor;

    if (currentTarget)
      currentTarget.addEventListener("keydown", onKeyDown)

    return () => {
      if (currentTarget)
        currentTarget.removeEventListener("keydown", onKeyDown)
    }
  }, [])

  const onKeyDown = (e) => {
    if (e.key == "Enter" && (e.metaKey || e.ctrlKey)) {
      setSubmit(true)
      e.preventDefault()
    }
  }

  const onChange = value => {
    setBody(value)

    const tempHtml = value.toString("html")
    const tempText = value.getEditorState().getCurrentContent().getPlainText() // value.toString("markdown")

    if (submit) { onSubmit() }

    //show help text after typing
    if (tempText.length >= 3) {
      if (!showFooter) setShowFooter(true)
    } else {
      setShowFooter(false)
    }
  }

  const onSubmit = () => {
    const newBody = body.toString("html")
    const newBodyText = body.getEditorState().getCurrentContent().getPlainText()
    if (response) {
      chrome.runtime.sendMessage({
        message: "update_response",
        response: response,
        body: newBodyText
      })
    } else {
      chrome.runtime.sendMessage({
        message: "create_response",
        respondableId: respondableId,
        response: { body: newBodyText, parentId: parentId }
      })
    }
  }

  return (
    <div className={`responseForm ${className ? className: ""} ${showFooter ? "showFooter" : ""}`}>
      <div className="knotEditorWrapper">
        <div className="knotEditor" ref={knotEditor}>
          <RichTextEditor
            autoFocus
            toolbarConfig={{ display: [] }}
            value={body}
            onChange={onChange}
            onBlur={onSubmit}
            placeholder={"Your response..."}
          />
        </div>
      </div>
      <div className="knotCardFooter">
        <KeyboardShortcut
          show={showFooter}
          text={response ? "Save" : "Post"}
          keys={['CMD', 'ENTER']}
        />
      </div>
    </div>
  )
}

export default ResponseInput;
