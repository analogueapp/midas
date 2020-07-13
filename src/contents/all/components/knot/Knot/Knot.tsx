import React, { useState } from 'react';
import Moment from 'react-moment';
import { Timeline, Popconfirm, DatePicker, Tooltip } from 'antd';

import { Log, Knot as KnotType } from '../../../global/types';

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

interface Props {
  log: Log
  key: number
  knot: KnotType
  index: number
  totalKnots: number
  isLast: boolean
  createKnot: (bodyHtml: string, bodyText: string) => void
}

// <div className={`knotCard ${props.knot.private ? "private" : ""}`}>
//   <div className="trix-content" dangerouslySetInnerHTML={{__html: props.knot.body}} />
// </div>

const Knot = props => {
  const [show, setShow] = useState(true)
  const [loading, setLoading] = useState(false)
  const [edited, setEdited] = useState(false)
  const [hover, setHover] = useState(false)

  const deleteKnot = (knot) => {
    setLoading(true)
    setShow(false)
    chrome.runtime.sendMessage({
      message: "delete_knot",
      log: props.log,
      knot: props.knot
    })
  }

  return (
    <Timeline.Item className={`knot ${props.isLast ? "ant-timeline-item-last" : ""}`}>
      <div
        className={`knotCard ${props.knot.private ? "private" : ""}`}
        onClick={() => setEdited(true)}
      >
        {edited
          ? (
            <KnotInput
              knot={props.knot}
              createKnot={props.createKnot}
            />
          )
          : <div className="trix-content" dangerouslySetInnerHTML={{__html: props.knot.body}} />
        }
      </div>
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
      </div>
      <div
        className='noteCardFooter'
        onMouseOver={() => setHover(true)}
        onMouseOut={() => setHover(false)}
      >
        <Popconfirm
          title="Delete note?"
          okText="Delete"
          okType="default"
          overlayClassName="deleteConfirm"
          icon={null}
          onConfirm={deleteKnot}
        >
          <span className={`hasAction "show" `}>
            Delete
          </span>
        </Popconfirm>
      </div>
    </Timeline.Item>
  )
}

export default Knot;
