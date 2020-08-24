import React, { useState, useEffect } from 'react';

import NumberCount from '../../common/NumberCount';
import Response from '../Response/Response';

import { Log, Response as ResponseType } from '../../../global/types';

import './Responses.scss';

interface Props {
  responses: ResponseType[]
  log: Log
}

const Responses = ({ responses, log }: Props) => {

  const renderResponses = responses =>
    responses.map(response => {
      if (response.responses && response.responses.length > 0) {
        return (
          <Response key={response.id} response={response} log={log}>
            {renderResponses(response.responses)}
          </Response>
        )
      }
      return (
        <Response key={response.id} response={response} log={log}/>
      )
    })

  return (
    <div className='responses'>
      {renderResponses(responses)}
    </div>
  )
}

export default Responses;
