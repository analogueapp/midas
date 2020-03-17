import React, { useState } from 'react';

import { Content, Log } from '../../../global/types';
import PrimerItem from '../PrimerItem/PrimerItem';
import PrimerCreate from './PrimerCreate/PrimerCreate';

import { DownOutlined, LoadingOutlined } from '@ant-design/icons';
import './PrimerSelect.scss';

interface Props {
  content: Content
  log: Log
}

const PrimerSelect = (props: Props) => {

  const [show, setShow] = useState(false)
  const toggleShow = () => setShow(!show)

  const [primers, setPrimers] = useState([])

  return (
    <div className="primerSelect">
      <div className={`primerSelectAction ${show ? "show" : ""}`} onClick={toggleShow}>
        <PrimerItem collection={props.content.collection} />
        <DownOutlined />
      </div>

      <div className={`primerSelectList ${show ? "show" : ""}`}>
        <div className="primerSelectListFooter">
          <PrimerCreate
            showParent={show}
            defaultShowInput={primers.length === 0}
            toggleShowParent={toggleShow}
          />
        </div>
      </div>
    </div>
  )
}

export default PrimerSelect
