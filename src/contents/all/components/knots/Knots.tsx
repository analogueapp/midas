import React from 'react';

import Knot from './Knot/Knot';

import './Knots.scss';

const Knots = props => {
  if (props.knots && props.knots.length > 0) {
    return (
      <div className="knots">
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
      </div>
    )
  }
  return null
}

export default Knots;
