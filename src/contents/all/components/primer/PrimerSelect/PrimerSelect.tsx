import React, { useState, useRef } from 'react';

import { Content, Log } from '../../../global/types';
import PrimerItem from '../PrimerItem/PrimerItem';
import PrimerCreate from './PrimerCreate/PrimerCreate';

import { DownOutlined, LoadingOutlined } from '@ant-design/icons';
import './PrimerSelect.scss';

interface Props {
  log: Log
  content: Content
  updatePrimersHeight: (height: number) => void
}

const PrimerSelect = (props: Props) => {

  const [show, setShow] = useState(false)
  const toggleShow = () => {
    props.updatePrimersHeight(show ? 0 : _container.current.clientHeight)
    setShow(!show)
  }

  const [primers, setPrimers] = useState([])

  const _container = useRef<HTMLInputElement>(null);

  return (
    <div className="primerSelect" ref={_container}>
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
