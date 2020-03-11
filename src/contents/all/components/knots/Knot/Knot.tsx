import React from 'react';

import { Timeline } from 'antd';

import './Knot.scss';

const Knot = props => (
  <Timeline.Item className={`knot ${props.isLast ? "ant-timeline-item-last" : ""}`}>
    <div className={`knotCard ${props.knot.private ? "private" : ""}`}>
      <div className="trix-content" dangerouslySetInnerHTML={{__html: props.knot.body}} />
    </div>
  </Timeline.Item>
)

export default Knot;
