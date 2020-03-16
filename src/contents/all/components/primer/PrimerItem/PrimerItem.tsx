import React from 'react';
import { List, Button } from 'antd';
import { Primer, Log } from '../../../global/types';

import ProgressiveImage from 'react-progressive-image';
import placeholderImg from '../../../assets/img/placeholders/placeholder_1x1.jpg';

import { mediumIcons } from '../../content/ContentMedium/ContentMedium';
import { LockOutlined, CheckOutlined, UsergroupAddOutlined } from '@ant-design/icons';

import './PrimerItem.scss'

interface Props {
  // updateCurrentPrimers?: (currentSelected: boolean) => void
  collection: string
  selectable: boolean
  selected: boolean
  primer: Primer
  log: Log
}

interface State {
  selected: boolean
}

class PrimerItem extends React.Component<Props, State> {
  
  state = {
    selected: this.props.selected ? true : false,
  }

  togglePrimer = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const currentSelected = this.state.selected;
    this.setState({ selected: !currentSelected })

    if (this.state.selected) {
      // todo add to primer
      // agent.Primers.removeLog(this.props.primer.slug, this.props.log.id).then(
      //   res => this.props.updateCurrentPrimers(currentSelected)
      // )
    } else {
      // agent.Primers.addLog(this.props.primer.slug, this.props.log.id).then(
      //   res => this.props.updateCurrentPrimers(currentSelected)
      // )
    }
  }

  render() {

    if (this.props.collection) {
      return (
        <List.Item className={`primerItem collection ${this.props.selectable ? "selected" : ""}`}>
          <div className="imgWrapper">
            {mediumIcons[this.props.collection]}
          </div>

          <h5 className="title">{this.props.collection}</h5>

          {this.props.selectable &&
            <div className="addBtn">
              <Button><Icon type="check" /></Button>
            </div>
          }
        </List.Item>
      )
    }

    return (
      <List.Item
        className={`primerItem ${this.state.selected ? "selected" : ""}`}
        onClick={this.props.selectable ? this.togglePrimer : null}
      >
        <div className="imgWrapper">
          <ProgressiveImage
            src={this.props.primer.image}
            placeholder={placeholderImg}
          >
            {(src, loading) => (
              <img src={src} alt={this.props.primer.title} />
            )}
          </ProgressiveImage>
        </div>

        <h5 className="title">{this.props.primer.title}</h5>

        <ul className="ant-list-item-action">
          {this.props.primer.shared && <li><UsergroupAddOutlined /></li>}
          {this.props.primer.private && <li><LockOutlined /></li>}
        </ul>

        {this.props.selectable &&
          <div className="addBtn">
            <Button>{this.state.selected ? <CheckOutlined /> : "Add"}</Button>
          </div>
        }
      </List.Item>
    )
  }
}

export default PrimerItem
