import React, { useState } from 'react';

import { Content, Log } from '../../../global/types';
import PrimerItem from '../PrimerItem/PrimerItem';

import { DownOutlined } from '@ant-design/icons';
import './PrimerSelect.scss';

interface Props {
  content: Content
  log: Log
}

const PrimerSelect = (props: Props) => {

  const [show, setShow] = useState(false)
  const toggleShow = () => setShow(!show)

  return (
    <div className="primerSelect">
      <div className="primerSelectAction" onClick={toggleShow}>
        <PrimerItem collection={props.content.collection} />
        <DownOutlined className={`${show ? "show" : ""}`}/>
      </div>
      <div className={`primerSelectList ${show ? "show" : ""}`}>
        <p>test</p>
      </div>
    </div>
  )
}

export default PrimerSelect
