import React, { useState } from 'react';

import Knot from '../Knot/Knot';
import KnotInput from '../KnotInput/KnotInput';

import { Timeline } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import { Log } from '../../../global/types'

import './Knots.scss';

interface Props {
  log: Log
  knots: any[]
  loading: boolean
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  primersHeight: number
}

const Knots = (props: Props) => {

  const hasKnots = props.knots && props.knots.length > 0

  const createKnot = (bodyHtml, bodyText) => {
    props.setLoading(true)
    chrome.runtime.sendMessage({
      message: "create_knot",
      log: props.log,
      knot: {
        body: bodyHtml,
        bodyText: bodyText
      }
    })
  }

  return (
    <div
      style={props.primersHeight ? { maxHeight: `calc(100vh - ${275 + props.primersHeight}px)` } : {}}
      className={`knots ${props.log ? "show" : ""}`}
    >
    <Timeline.Item className={`knot ${hasKnots ? "" : "ant-timeline-item-last"}`}>
      <div className="knotCard">
        <KnotInput
          createKnot={createKnot}
          hasKnots={hasKnots}
        />
      </div>
    </Timeline.Item>
      {props.loading &&
        <Timeline.Item
          dot={<LoadingOutlined />}
          className={`knotLoading ${hasKnots ? "" : "ant-timeline-item-last"}`}
        />
      }
      {hasKnots &&
        props.knots.map((knot, index) =>
          <Knot
            log={props.log}
            key={knot.id}
            knot={knot}
            index={index}
            totalKnots={props.knots.length}
            isLast={props.knots.length-1 === index}
            createKnot={createKnot}
          />
        )
      }
    </div>
  )
}

export default Knots;
