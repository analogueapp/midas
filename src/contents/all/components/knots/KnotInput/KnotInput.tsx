import React, { useState } from 'react';
import { Timeline } from "antd";
import RichTextEditor from 'react-rte/lib/RichTextEditor';

import "../Knot/Knot.scss"
import "./KnotInput.scss";

const KnotInput = props => {

  const [body, setBody] = useState(RichTextEditor.createEmptyValue())

  const onChange = (value) => setBody(value)

  return (
    <Timeline.Item className={`knot ${props.hasKnots ? "" : "ant-timeline-item-last"}`}>
      <div className="knotCard">
        <div className="knotEditorWrapper">
          <div className="knotEditor">
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
    </Timeline.Item>
  )
}

export default KnotInput;
