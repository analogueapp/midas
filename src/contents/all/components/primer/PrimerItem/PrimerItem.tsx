import React, { useState } from 'react';
import { Button } from 'antd';
import { Primer, Log } from '../../../global/types';

import ProgressiveImage from 'react-progressive-image';
import placeholderImg from '../../../assets/img/placeholders/placeholder_1x1.jpg';

import { mediumIcons } from '../../content/ContentMedium/ContentMedium';
import { LockOutlined, CheckOutlined, UsergroupAddOutlined } from '@ant-design/icons';

import './PrimerItem.scss'

interface Props {
  log?: Log
  primer?: Primer
  collection?: string
  selectable?: boolean
  selected?: boolean
  updateCurrentPrimers?: (primer: Primer, remove: boolean) => void
}

const PrimerItem = (props: Props) => {

  const [selected, setSelected] = useState(props.selected || false)

  const togglePrimer = (e) => {
    props.updateCurrentPrimers(props.primer, selected)
    setSelected(!selected)
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
      onClick={props.selectable ? togglePrimer : null}
    >
      {props.selectable &&
        <div className="addBtn">
          <Button>{selected ? <CheckOutlined /> : "Add"}</Button>
        </div>
      }
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

      {props.primer.shared && <UsergroupAddOutlined className="infoIcon" /> }
      {props.primer.private && <LockOutlined className="infoIcon" /> }
    </div>
  )
}

export default PrimerItem
