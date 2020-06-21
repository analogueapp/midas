import React from 'react';
import Moment from 'react-moment';

import { Timeline } from 'antd';

import './Knot.scss';
import '../Trix.scss';

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
    </div>
  </Timeline.Item>
)

export default Knot;
