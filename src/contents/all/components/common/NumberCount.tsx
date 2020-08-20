import React from 'react';
import NumericLabel from 'react-pretty-numbers';

const NumberCount = props => {
  return (
    <NumericLabel
      params={{
        currency: false,
        precision: props.count > 1099 ? 1 : 0,
        shortFormat: true,
        justification: 'L'
      }}
    >
      {props.count}
    </NumericLabel>
  );
};

export default NumberCount;
