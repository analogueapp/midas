import React, { useState } from 'react';
import Moment from 'react-moment';
import { Timeline, Popconfirm, DatePicker, Tooltip } from 'antd';

import { Log } from '../../../global/types';

import KnotInput from '../KnotInput/KnotInput';

import './Knot.scss';
import '../Trix.scss';

// <div className="knotEditorWrapper">
//   <div className="knotEditor" ref={knotEditor}>
//     {show &&
//       <RichTextEditor
//         autoFocus
//         toolbarConfig={{ display: [] }}
//         value={body}
//         onChange={onChange}
//         placeholder={hasKnots ? "Add another note..." : "Add a note..."}
//       />
//     }
//   </div>
// </div>

// <span className={`hasAction ${noteHover || isMobile ? "show" : "hide"}`}>
//   {deleteLoading ? <Icon type='loading' /> : 'Delete'}
// </span>

interface Props {
  log: Log
  key: number
  knot: Knot
  index: number
  totalKnots: number
  isLast: boolean
  createKnot: (bodyHtml: string, bodyText: string) => void
}

// <div className={`knotCard ${props.knot.private ? "private" : ""}`}>
//   <div className="trix-content" dangerouslySetInnerHTML={{__html: props.knot.body}} />
// </div>

const Knot = props => {

  const [loading, setLoading] = useState(false)

  const editKnot = (bodyHtml, bodyText) => {
    setLoading(true)
    chrome.runtime.sendMessage({
      message: "edit_knot",
      log: props.log,
      knot: {
        body: bodyHtml,
        bodyText: bodyText
      }
    })
  }

  const deleteKnot = (knot) => {
    setLoading(true)
    chrome.runtime.sendMessage({
      message: "delete_knot",
      log: props.log,
      knot: props.knot
    })
  }

  return (
    
    <Timeline.Item className={`knot ${props.isLast ? "ant-timeline-item-last" : ""}`}>
      <KnotInput
        knot={props.knot.body}
        show={true}
        createKnot={props.createKnot}
        editKnot={editKnot}
      />
      <div className="knotMeta">
        <Moment
          filter={(value) =>
            value.replace(/^a few seconds ago/g, 'just now')
            .replace(/^a /g, '1 ')
            .replace(/^an /g, '1 ')
            .replace("minute", 'min')
          }
          fromNow
        >
          {props.knot.postedAt}
        </Moment>
        <Popconfirm
          title="Delete note?"
          okText="Delete"
          okType="default"
          overlayClassName="deleteConfirm"
          icon={null}
          onConfirm={deleteKnot}
        >
        </Popconfirm>
      </div>
    </Timeline.Item>
  )
}

export default Knot;
