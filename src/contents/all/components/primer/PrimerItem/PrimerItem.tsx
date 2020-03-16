import React, { useState } from 'react';
import { Button } from 'antd';
import { Primer, Log } from '../../../global/types';

import ProgressiveImage from 'react-progressive-image';
import placeholderImg from '../../../assets/img/placeholders/placeholder_1x1.jpg';

import { mediumIcons } from '../../content/ContentMedium/ContentMedium';
import { LockOutlined, CheckOutlined, UsergroupAddOutlined } from '@ant-design/icons';

import './PrimerItem.scss'

interface Props {
  // updateCurrentPrimers?: (currentSelected: boolean) => void
  log: Log
  primer: Primer
  collection?: string
  selectable?: boolean
  selected?: boolean
}

const PrimerItem = (props: Props) => {

  const [selected, setSelected] = useState(props.selected ? true : false)

  const togglePrimer = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const currentSelected = selected;
    setSelected(!selected)

    if (selected) {
      // todo add to primer
      // agent.Primers.removeLog(props.primer.slug, props.log.id).then(
      //   res => props.updateCurrentPrimers(currentSelected)
      // )
    } else {
      // agent.Primers.addLog(props.primer.slug, props.log.id).then(
      //   res => props.updateCurrentPrimers(currentSelected)
      // )
    }
  }

  if (props.collection) {
    return (
      <div className={`primerItem collection ${props.selectable ? "selectable selected" : ""}`}>
        <div className="imgWrapper">
          {mediumIcons[props.collection]}
        </div>

        <h5 className="title">{props.collection}</h5>

        {props.selectable &&
          <div className="addBtn">
            <Button><CheckOutlined /></Button>
          </div>
        }
      </div>
    )
  }

  return (
    <div
      className={`primerItem ${props.selectable ? "selectable" : ""} ${selected ? "selected" : ""}`}
      onClick={props.selectable ? this.togglePrimer : null}
    >
      <div className="imgWrapper">
        <ProgressiveImage
          src={props.primer.image}
          placeholder={placeholderImg}
        >
          {(src, loading) => (
            <img src={src} alt={props.primer.title} />
          )}
        </ProgressiveImage>
      </div>

      <h5 className="title">{props.primer.title}</h5>

      <ul className="ant-list-item-action">
        {props.primer.shared && <li><UsergroupAddOutlined /></li>}
        {props.primer.private && <li><LockOutlined /></li>}
      </ul>

      {props.selectable &&
        <div className="addBtn">
          <Button>{selected ? <CheckOutlined /> : "Add"}</Button>
        </div>
      }
    </div>
  )
}

export default PrimerItem
