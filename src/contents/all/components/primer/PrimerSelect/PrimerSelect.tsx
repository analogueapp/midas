/*global chrome*/

import React, { useState, useRef, useEffect } from 'react';

import { Content, Log, Primer } from '../../../global/types';
import PrimerItem from '../PrimerItem/PrimerItem';
import PrimerCreate from './PrimerCreate/PrimerCreate';

import { Input } from 'antd';
import { SearchOutlined, LoadingOutlined, DownOutlined } from '@ant-design/icons';
import './PrimerSelect.scss';

interface Props {
  log: Log
  content: Content
  updatePrimersHeight: (height: number) => void
}

const PrimerSelect = ({
  log,
  content,
  updatePrimersHeight
}: Props) => {

  const [show, setShow] = useState(false)
  const toggleShow = () => {
    // _container.current.clientHeight doesn't calculate till after transition, so hard coding it
    const footerHeight = 71
    const primerItemHeight = 53
    updatePrimersHeight(
      show
      ? 0
      : primers.length < 5
        ? primers.length * primerItemHeight + footerHeight
        : 392
    )
    setShow(!show)
  }

  const defaultIconPrefix = 'SearchOutlined';
  const defaultPlaceholder = 'Search your collections';
  const [iconPrefix, setIconPrefix] = useState<string>(defaultIconPrefix)
  const [inputPlaceholder, setInputPlaceholder] = useState<string>(defaultPlaceholder)

  const [searchValue, setSearchValue] = useState<string>('')

  const [primers, setPrimers] = useState([])
  const [currentPrimerTitles, setCurrentPrimerTitles] = useState(log.currentPrimers.map((primer) => primer.title))
  const [filteredPrimers, setFilteredPrimers] = useState<Primer[]>(null)

  const _container = useRef<HTMLInputElement>(null)
  const _input = useRef<Input>(null)

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
        log.currentPrimers && log.currentPrimers.length > 0
        ? request.body.primers.filter(primer => !log.currentPrimers.map(current => current.id).includes(primer.id))
        : request.body.primers
      )
      // const primersAfterFilter = filterCurrentPrimers(primers)
      // setPrimers(primersAfterFilter)
      // setFilteredPrimers(primersAfterFilter)
    }
    if (request.message === "create_primer_response") {
      setPrimers([request.body.primer, ...primers])
    }
  }

  const filterCurrentPrimers = (primersToFilter: Primer[]) => {
    if (log && log.currentPrimers && log.currentPrimers.length > 0) {
      // TODO: refactor - there's a better way to do this

      // 1) add selected to each currentPrimer
      const currentPrimers = log.currentPrimers.map((primer: Primer) => {
        primer.selected = true
        return primer
      })

      // 2) get ids of current primers (for comparison)
      const currentPrimersIds = currentPrimers.map((primer: Primer) => primer.id)

      // 3) filter full primer lists based on currentPrimers
      const filteredPrimers = primersToFilter.filter((primer: Primer) => (
        !currentPrimersIds.includes(primer.id)
      ))

      // 4) combine arrays with currentPrimers at front of list
      return currentPrimers.concat(filteredPrimers)
    } else {
      return primersToFilter
    }
  }

  const resetFilter = () => {
    setSearchValue('')
    setFilteredPrimers(primers)
  }

  const loadingInput = () => {
    setIconPrefix('LoadingOutlined')
    setInputPlaceholder('Loading')
  }

  const resetInput = () => {
    setIconPrefix(defaultIconPrefix)
    setInputPlaceholder(defaultPlaceholder)
  }

  const onInputChange = e => {
    if (inputPlaceholder !== defaultPlaceholder) {
      setInputPlaceholder(defaultPlaceholder)
    }
    if (e.clear) {
      resetFilter()
    } else {
      const value = e.target.value;

      if (value.length === 0) {
        setIconPrefix(defaultIconPrefix)
      }

      setSearchValue(value)

      if (primers && primers.length > 0) {
        setFilteredPrimers(primers.filter((primer: Primer) =>
          primer.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
        ))
      }
    }
    // TODO handle enter press (add to first item in list or create collection + add)
  }

  const updateCurrentPrimers = (primer: Primer, remove: boolean) => {
    chrome.runtime.sendMessage({
      message: "update_primer",
      primer: primer,
      log: log,
      remove: remove
    })
    if (remove) {
      setCurrentPrimerTitles(currentPrimerTitles.filter(primerTitle => primerTitle !== primer.title ))
    } else {
      setCurrentPrimerTitles([primer.title, ...currentPrimerTitles])
    }
  }

  return (
    <div className="primerSelect">
      <div className={`primerSelectAction ${show ? "show" : ""}`} onClick={toggleShow}>
        {content && <PrimerItem collection={content.collection} /> }
        {currentPrimerTitles.length > 1
          ? <p>+ {currentPrimerTitles.length} collections</p>
          : currentPrimerTitles.length > 0
            ? <p>+ {currentPrimerTitles[0]}</p>
            : null
        }
        <DownOutlined />
      </div>

      <div className={`primerSelectList ${show ? "show" : ""}`} ref={_container}>
        <div className="primerSelectListScroll">
          {log && log.currentPrimers &&  log.currentPrimers.length > 0 &&
            log.currentPrimers.map(primer =>
              <PrimerItem
                key={primer.id}
                selected
                selectable
                log={log}
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
                log={log}
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
