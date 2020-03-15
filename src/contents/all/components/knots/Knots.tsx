import React from 'react';

import Knot from './Knot/Knot';
import KnotInput from './KnotInput/KnotInput';

import './Knots.scss';

const Knots = props => (
  <div className="knots">
    <KnotInput autoFocus hasKnots={props.knots && props.knots.length > 0} />
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

export default Knots;
