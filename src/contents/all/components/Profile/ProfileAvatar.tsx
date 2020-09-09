
import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { Avatar, Popover } from 'antd';

import ProfileImage from './ProfileImage';

import { User } from '../../global/types';

import './ProfileAvatar.scss';

interface Props {
  user: User
  noLink?: boolean
  placement?: any
  list?: boolean
  textOnly?: boolean
  noBlur?: boolean
  iconOnly?: boolean
  showFollowButton?: boolean
}

const rootUrl = process.env.NODE_ENV === 'production' ? 'https://www.analogue.app' : 'http://localhost:3000'

const ProfileAvatar = ({
  user,
  noLink,
  placement,
  list,
  textOnly,
  noBlur,
  iconOnly,
  showFollowButton
}: Props)=> {

  const [popoverProfile, setPopoverProfile] = useState(false)
  const [visible, setVisible] = useState(false)

  return(
      <span className={`profileAvatar ${list ? "listType" : ""}`}>
        {!textOnly && <ProfileImage user={user} noBlur={noBlur} />}
        {!iconOnly &&
          <a
            target="_blank"
            href={`${rootUrl}/@${user.username}`}
            className="profileName">{user.name}
          </a>
        }
      </span>
    )
  }

export default ProfileAvatar;
