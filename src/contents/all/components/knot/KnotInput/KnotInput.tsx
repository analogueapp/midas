import React, { useState, useRef, useEffect } from 'react';
import { Timeline } from "antd";
import RichTextEditor from 'react-rte/lib/RichTextEditor';

import { User, Knot, Log } from '../../../global/types';

import KeyboardShortcut from '../../common/KeyboardShortcut/KeyboardShortcut'

import "../Knot/Knot.scss"
import "./KnotInput.scss";

interface Props {
  knot?: Knot
  createKnot?: (bodyHtml: string, bodyText: string) => void
  hasKnots?: boolean
  setEdited?: React.Dispatch<React.SetStateAction<boolean>>
  setKnot?: React.Dispatch<React.SetStateAction<Knot>>
}

const KnotInput = ({knot, createKnot, hasKnots, setEdited, setKnot}: Props) => {

  const knotEditor = useRef(null)

  const [submit, setSubmit] = useState(false)
  const [showFooter, setShowFooter] = useState(false)
  const [body, setBody] = useState(knot ? RichTextEditor.createValueFromString(knot.body, 'html') : RichTextEditor.createEmptyValue())

  const [loading, setLoading] = useState(false)

  const updateKnot = (bodyHtml, bodyText) => {
    setLoading(true)
    const newKnot = {
      ...knot,
      body: bodyHtml,
      bodyText: bodyText
    }
    chrome.runtime.sendMessage({
      message: "edit_knot",
      knot: newKnot
    })
    setLoading(false)
    setEdited(false)
    setShowFooter(false)
  }

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

    // show help text after typing
    if (tempText.length >= 3) {
      if (!showFooter) setShowFooter(true)
    } else {
      setShowFooter(false)
    }
  }

  const onSubmit = () => {
    const newBody = body.toString("html")
    const newBodyText = body.getEditorState().getCurrentContent().getPlainText()

    if (newBodyText !== '') {
      if (knot) {
        if (knot.body !== newBody) {
          updateKnot(newBody, newBodyText)
          setKnot({ ...knot, body: newBody })
        }
        setEdited(false)
      } else {
        createKnot(newBody, newBodyText)
        setBody(RichTextEditor.createEmptyValue())
      }
      setSubmit(false)
    }
  }

  return (
    <>
      <div className="knotEditorWrapper">
        <div className="knotEditor" ref={knotEditor}>
          <RichTextEditor
            autoFocus
            toolbarConfig={{ display: [] }}
            value={body}
            onChange={onChange}
            onBlur={setEdited ? onSubmit : () => setShowFooter(false)}
            placeholder={hasKnots ? "Add another note..." : "Add a note..."}
          />
        </div>
      </div>
      <div className="knotCardFooter">
          {showFooter &&
            <KeyboardShortcut
              onClick={onSubmit} text="Save" keys={['CMD', 'ENTER']}
            />
          }
      </div>
    </>
  )
}

export default KnotInput;
