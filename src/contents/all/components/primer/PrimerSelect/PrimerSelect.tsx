/*global chrome*/

import React, { useState, useRef, useEffect } from 'react';

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

  const _container = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // TODO load primers from API on mount
  }, [])

  useEffect(() => {
    chrome.runtime.onMessage.addListener(messageListener)

    return () => {
      chrome.runtime.onMessage.removeListener(messageListener)
    }
  }, [primers])

  const messageListener = (request, sender, sendResponse) => {
    if (request.message === "create_primer_response") {
      setPrimers([request.body.primer, ...primers])
    }
  }

  return (
    <div className="primerSelect" ref={_container}>
      <div className={`primerSelectAction ${show ? "show" : ""}`} onClick={toggleShow}>
        <PrimerItem collection={props.content.collection} />
        <DownOutlined />
      </div>

      <div className={`primerSelectList ${show ? "show" : ""}`}>
        {primers && primers.length > 0 &&
          primers.map(primer =>
            <PrimerItem
              selectable
              log={props.log}
              primer={primer}
            />
          )
        }
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
