import React, { useEffect } from 'react';
import { connect, useSelector, useDispatch } from 'react-redux';
import { Link, StaticRouter } from 'react-router-dom';
import { Badge, Popover, Menu, Tooltip } from 'antd';
import { SearchOutlined, PlusOutlined, BellOutlined, LoadingOutlined } from '@ant-design/icons';

import ProfileImage from '../../Profile/ProfileImage';

import logoIcon from '../../../assets/img/logo_icon.png';
import './BottomBar.scss'

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

            <div className="item">
              <span className="wrapper">
                <div className="icon search"><SearchOutlined /></div>
                <p>Search</p>
              </span>
            </div>

            <div className="item" onClick={clickHint}>
              <span className="wrapper">
                <div className="icon search"><PlusOutlined /></div>
              </span>
            </div>


            <div className="item">
              <a target="_blank" href={rootUrl}>
                <img src={logoIcon} alt="explore" />
              </a>
            </div>

            <div className="item" onClick={clickActivity}>
              <span className="wrapper">
                <div className="icon activity"><BellOutlined /></div>
              </span>
            </div>

            <div className={"item"}>
              <a target="_blank" href={`${rootUrl}/@${currentUser.username}`}>
                <div className="icon">
                  <ProfileImage user={currentUser} />
                </div>
              </a>
            </div>
        </div>
      }
      {!currentUser &&
        <LoadingOutlined />
      }
    </div>
  )
}

export default BottomBar;
