import React, { useState, useEffect } from 'react';

import Knot from '../Knot/Knot';
import KnotInput from '../KnotInput/KnotInput';

import { Timeline } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import { Log } from '../../../global/types'

import './Knots.scss';

interface Props {
  log: Log
  knots: any
  loading: boolean
  primersHeight: number
  createKnot: (bodyHtml: string, bodyText: string) => void
}

const Knots = ({
  log,
  knots,
  loading,
  primersHeight,
  createKnot
}: Props) => {

  useEffect(() => {
    if (log && !knots) {
      chrome.runtime.sendMessage({ message: "get_knots", log: log })
    }
  }, [log])

  const hasKnots = knots && knots.length > 0;

  return (
    <>
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

        {knots && knots.map((knot, index) =>
          <Knot
            key={knot.id}
            log={log}
            knot={knot}
            isLast={knots.length-1 === index}
          />
        )}
      </div>
      {!knots && log && <div className='loadingKnots'><LoadingOutlined /></div> }
    </>
  )
}

export default Knots;
