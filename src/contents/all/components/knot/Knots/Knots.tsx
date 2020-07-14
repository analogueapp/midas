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

const Knots = ({log, knots, loading, setLoading, primersHeight}: Props) => {

  const hasKnots = knots && knots.length > 0

  const createKnot = (bodyHtml, bodyText) => {
    setLoading(true)
    chrome.runtime.sendMessage({
      message: "create_knot",
      log: log,
      knot: {
        body: bodyHtml,
        bodyText: bodyText
      }
    })
  }

  return (
    <div
      style={primersHeight ? { maxHeight: `calc(100vh - ${275 + primersHeight}px)` } : {}}
      className={`knots ${log ? "show" : ""}`}
    >
    <Timeline.Item className={`knot ${hasKnots ? "" : "ant-timeline-item-last"}`}>
      <div className="knotCard">
        <KnotInput
          createKnot={createKnot}
          hasKnots={hasKnots}
        />
      </div>
    </Timeline.Item>
      {loading &&
        <Timeline.Item
          dot={<LoadingOutlined />}
          className={`knotLoading ${hasKnots ? "" : "ant-timeline-item-last"}`}
        />
      }
      {hasKnots &&
        knots.map((knot, index) =>
          <Knot
            log={log}
            key={knot.id}
            knot={knot}
            index={index}
            totalKnots={knots.length}
            isLast={knots.length-1 === index}
            createKnot={createKnot}
          />
        )
      }
    </div>
  )
}

export default Knots;
