import React from 'react';
import FlipMove from 'react-flip-move';

import Knot from './Knot/Knot';
import KnotEditor from './KnotEditor/KnotEditor';

import './Knots.scss';

const Knots = props => (
  <div className="knots">
    <KnotEditor autoFocus hasKnots={props.knots && props.knots.length > 0} />
    <FlipMove
      duration={300}
      staggerDelayBy={40}
      enterAnimation="fade"
      leaveAnimation="fade"
      appearAnimation="fade"
      typeName={null}
    >
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
    </FlipMove>
  </div>
)

export default Knots;
