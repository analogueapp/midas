import React from 'react';

import Knot from './Knot/Knot';
import KnotInput from './KnotInput/KnotInput';

import { Timeline } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import './Knots.scss';

const Knots = props => {
  const hasKnots = props.knots && props.knots.length > 0

  return (
    <div className="knots">
      <KnotInput
        show={props.show}
        createKnot={props.createKnot}
        hasKnots={hasKnots}
      />
      {props.loading &&
        <Timeline.Item
          dot={<LoadingOutlined />}
          className={`knotLoading ${hasKnots ? "" : "ant-timeline-item-last"}`}
        />
      }
      {props.knots &&
        <>
        {props.knots.map((knot, index) =>
          <Knot
            key={knot.id}
            knot={knot}
            index={index}
            totalKnots={props.knots.length}
            log={props.log}
            isLast={props.knots.length-1 === index}
          />
        )}
        </>
      }
    </div>
  )
}

export default Knots;
