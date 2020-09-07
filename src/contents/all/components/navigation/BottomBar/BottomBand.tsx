import React, { useEffect } from 'react';
import { connect, useSelector, useDispatch } from 'react-redux';
import { Link, StaticRouter } from 'react-router-dom';
import { Badge, Popover, Menu, Tooltip } from 'antd';
import { SearchOutlined, PlusOutlined, BellOutlined, LoadingOutlined } from '@ant-design/icons';

import ProfileImage from '../../Profile/ProfileImage';
import KeyboardShortcut from '../../common/KeyboardShortcut/KeyboardShortcut';

import logo from '../../../assets/img/logo.png';
import './BottomBand.scss'

interface Props {
  clickHint?: () => void
  clickActivity?: () => void
}

const rootUrl = process.env.NODE_ENV === 'production' ? 'https://www.analogue.app' : 'http://localhost:3000'

const BottomBar = ({ clickHint, clickActivity }: Props) => {

  const currentUser = useSelector(state => state.user);

  return (
    <div className="bottomBar">
      {currentUser &&
        <div className="navigationMenu">
            <div className="item" onClick={clickHint}>
              <span className="wrapper">
                <img src={logo} alt="Log this page" />
              </span>
            </div>

            <span className="hint" >
              <KeyboardShortcut onClick={clickHint} show={true} hint={"Log content with:"} keys={['CMD', 'shift', 'A']} />
            </span>
        </div>
      }
      {!currentUser &&
        <LoadingOutlined />
      }
    </div>
  )
}

export default BottomBar;
