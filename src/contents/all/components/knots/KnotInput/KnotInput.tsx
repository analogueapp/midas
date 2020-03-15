import React, { useState } from 'react';

import { Timeline, Input } from "antd";

import "../Knot/Knot.scss"
import "./KnotInput.scss";

const KnotInput = props => {

  const [body, setBody] = useState(props.knot ? props.knot.body : "")

  const onChange = ({ target: { value } }) => setBody(value)

  return (
    <Timeline.Item className={`knot ${props.hasKnots ? "" : "ant-timeline-item-last"}`}>
      <div className="knotCard">
        <div className="knotEditorWrapper">
          <div className="knotEditor">
            <Input.TextArea
              autoSize
              value={body}
              autoFocus={props.autoFocus}
              onChange={onChange}
              placeholder={props.hasKnots ? "Add another note..." : "Add a note..."}
            />
          </div>
        </div>
      </div>
    </Timeline.Item>
  )
}

export default KnotInput;
