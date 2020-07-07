import React from 'react';
import Moment from 'react-moment';

import { Timeline, Icon, Popconfirm, DatePicker, Tooltip } from 'antd';

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

const Knot = props => (
  <Timeline.Item className={`knot ${props.isLast ? "ant-timeline-item-last" : ""}`}>
    <div className={`knotCard ${props.knot.private ? "private" : ""}`}>
      <div className="trix-content" dangerouslySetInnerHTML={{__html: props.knot.body}} />
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
      <Popconfirm
        title="Delete note?"
        okText="Delete"
        okType="default"
        overlayClassName="deleteConfirm"
        icon={null}
        onConfirm={deleteKnot}
      >
        <span className={`hasAction ${noteHover || isMobile ? "show" : "hide"}`}>
          {deleteLoading ? <Icon type='loading' /> : 'Delete'}
        </span>
      </Popconfirm>
    </div>
  </Timeline.Item>
)

export default Knot;
