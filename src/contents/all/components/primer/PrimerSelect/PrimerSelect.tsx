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
    // _container.current.clientHeight doesn't calculate till after transition, so hard coding it
    const footerHeight = 71
    const primerItemHeight = 53
    props.updatePrimersHeight(
      show
      ? 0
      : primers.length < 5
        ? primers.length * primerItemHeight + footerHeight
        : 392
    )
    setShow(!show)
  }

  const [primers, setPrimers] = useState([])

  const _container = useRef<HTMLInputElement>(null)

  useEffect(() => {
    chrome.runtime.sendMessage({ message: "get_primers" })

    return () => null
  }, [])

  useEffect(() => {
    chrome.runtime.onMessage.addListener(messageListener)

    return () => {
      chrome.runtime.onMessage.removeListener(messageListener)
    }
  }, [primers])

  const messageListener = (request, sender, sendResponse) => {
    if (request.message === "get_primers_response") {
      setPrimers(request.body.primers)
    }
    if (request.message === "create_primer_response") {
      setPrimers([request.body.primer, ...primers])
    }
  }

  return (
    <div className="primerSelect">
      <div className={`primerSelectAction ${show ? "show" : ""}`} onClick={toggleShow}>
        <PrimerItem collection={props.content.collection} />
        <DownOutlined />
      </div>

      <div className={`primerSelectList ${show ? "show" : ""}`} ref={_container}>
        <div className="primerSelectListScroll">
          {primers && primers.length > 0 &&
            primers.map(primer =>
              <PrimerItem
                key={primer.id}
                selectable
                log={props.log}
                primer={primer}
              />
            )
          }
        </div>
        <div className={`primerSelectListFooter ${primers.length === 0 ? "soloItem" : ""}`}>
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
