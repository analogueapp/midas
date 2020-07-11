import React, { useState, useRef, useEffect } from 'react';
import { Timeline } from "antd";
import RichTextEditor from 'react-rte/lib/RichTextEditor';

import { User, Knot, Log } from '../../../global/types';

import KeyboardShortcut from '../../common/KeyboardShortcut/KeyboardShortcut'

import "../Knot/Knot.scss"
import "./KnotInput.scss";

interface Props {
  knot?: string
  createKnot: (bodyHtml: string, bodyText: string) => void
  editKnot?: (bodyHtml: string, bodyText: string) => void
  hasKnots?: boolean
}

const KnotInput = ({knot, createKnot, editKnot, hasKnots}: Props) => {

  const knotEditor = useRef(null)

  const [submit, setSubmit] = useState(false)
  const [showFooter, setShowFooter] = useState(false)
  const [body, setBody] = useState(RichTextEditor.createEmptyValue())

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const targetIsRef = knotEditor.hasOwnProperty("current")
    const currentTarget = targetIsRef ? knotEditor.current : knotEditor;
    if (knot) {
      setBody(knot)
    }
    if (currentTarget)
      currentTarget.addEventListener("keydown", onKeyDown)
    return () => {
      if (currentTarget)
        currentTarget.removeEventListener("keydown", onKeyDown)
    };
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

    if (submit) {
      if (knot) {
        editKnot(
          tempHtml.substring(0, tempHtml.length-11), // remove last line <p><br></p>
          tempText.replace(/(\r\n|\n|\r)/gm, ""), // remove trailing line break
        )
      }
      else {
        createKnot(
          tempHtml.substring(0, tempHtml.length-11), // remove last line <p><br></p>
          tempText.replace(/(\r\n|\n|\r)/gm, ""), // remove trailing line break
        )
      }
      setSubmit(false)
      setBody(RichTextEditor.createEmptyValue())
    }

    // show help text after typing
    if (tempText.length >= 3) {
      if (!showFooter) setShowFooter(true)
    } else {
      setShowFooter(false)
    }
  }

  const onSubmit = () => {
    if (knot) {
      editKnot(
        body.toString("html"),
        body.getEditorState().getCurrentContent().getPlainText()
      )
    }
    else {
      createKnot(
        body.toString("html"),
        body.getEditorState().getCurrentContent().getPlainText()
      )
    }
    setSubmit(false)
    setBody(RichTextEditor.createEmptyValue())
  }

  return (
    <Timeline.Item className={`knot ${hasKnots ? "" : "ant-timeline-item-last"}`}>
      <div className="knotCard">
        <div className="knotEditorWrapper">
          <div className="knotEditor" ref={knotEditor}>
            <RichTextEditor
              autoFocus
              toolbarConfig={{ display: [] }}
              value={body}
              onChange={onChange}
              placeholder={hasKnots ? "Add another note..." : "Add a note..."}
            />
          </div>
        </div>
      </div>
      <div className="knotCardFooter">
        {showFooter && <KeyboardShortcut onClick={onSubmit} text="Save" keys={['CMD', 'ENTER']} /> }
      </div>
    </Timeline.Item>
  )
}

export default KnotInput;
