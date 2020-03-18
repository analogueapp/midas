/*global chrome*/

import React, { useState, useRef, useEffect } from 'react';

import { Content, Log, Primer } from '../../../global/types';
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
  const [currentPrimerTitles, setCurrentPrimerTitles] = useState(props.log.currentPrimers.map((primer) => primer.title))

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
      setPrimers(
        props.log.currentPrimers && props.log.currentPrimers.length > 0
        ? request.body.primers.filter(primer => !props.log.currentPrimers.map(current => current.id).includes(primer.id))
        : request.body.primers
      )
    }
    if (request.message === "create_primer_response") {
      setPrimers([request.body.primer, ...primers])
    }
  }

  const updateCurrentPrimers = (primer: Primer, remove: boolean) => {
    // TODO
    // chrome.runtime.sendMessage({ message: "update_primer", primer: primer, log: log })
    if (remove) {
      setCurrentPrimerTitles(currentPrimerTitles.filter(primerTitle => primerTitle !== primer.title ))
    } else {
      setCurrentPrimerTitles([primer.title, ...currentPrimerTitles])
    }
  }

  return (
    <div className="primerSelect">
      <div className={`primerSelectAction ${show ? "show" : ""}`} onClick={toggleShow}>
        <PrimerItem collection={props.content.collection} />
        {currentPrimerTitles.length > 1
          ? <p>+ {currentPrimerTitles.length} collections</p>
          : <p>+ {currentPrimerTitles[0]}</p>
        }
        <DownOutlined />
      </div>

      <div className={`primerSelectList ${show ? "show" : ""}`} ref={_container}>
        <div className="primerSelectListScroll">
          {props.log && props.log.currentPrimers &&  props.log.currentPrimers.length > 0 &&
            props.log.currentPrimers.map(primer =>
              <PrimerItem
                key={primer.id}
                selected
                selectable
                log={props.log}
                primer={primer}
                updateCurrentPrimers={updateCurrentPrimers}
              />
            )
          }
          {primers && primers.length > 0 &&
            primers.map(primer =>
              <PrimerItem
                key={primer.id}
                selectable
                log={props.log}
                primer={primer}
                updateCurrentPrimers={updateCurrentPrimers}
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
