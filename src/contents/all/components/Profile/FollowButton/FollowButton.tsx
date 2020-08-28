import React, { useEffect, useState} from 'react';
import { useSelector } from 'react-redux';
import { Button, Tooltip } from 'antd';
import { CheckOutlined, PlusOutlined, CloseOutlined } from '@ant-design/icons';

import { Profile } from '../../../global/types';

import '../../Anchor/Anchor.scss';

interface Props {
  profile: Profile
}

const FollowButton = ({ profile }: Props) => {

  const currentUser = useSelector(state => state.user);
  const [following, setFollowing] = useState(profile.following)
  const [showUnfollow, setShowUnfollow] = useState(false)

  useEffect(() => {
    chrome.runtime.onMessage.addListener(messageListener)

    return () => {
      chrome.runtime.onMessage.removeListener(messageListener)
    }
  }, [following])

  const messageListener = (request, sender, sendResponse) => {
    if (request.message === "unfollow_profile_response") {
      setFollowing(false)
    }

    if (request.message === "follow_profile_response") {
      setFollowing(true)
    }
  }

  const handleFollowClick = (e) => {
    // e.preventDefault();
    // e.stopPropagation();
    setShowUnfollow(false);

    if (following) {
      chrome.runtime.sendMessage({
        message: "unfollow_profile",
        profile: profile,
      })
    } else {
      chrome.runtime.sendMessage({
        message: "follow_profile",
        profile: profile,
      })
    }
  }

  if (currentUser && currentUser.username === profile.username) {
    return null
  }

  return (
    <Tooltip
      arrowPointAtCenter
      title={following ? "Unfollow" : "Follow"}
      placement="bottomRight"
    >
      <div
        className={`anchorButton ${following ? "pressed" : ""}`}
        onMouseEnter={following ? () => setShowUnfollow(true) : null}
        onMouseLeave={following ? () => setShowUnfollow(false) : null}
      >
        <Button
        icon={showUnfollow ? <CloseOutlined /> : following ? <CheckOutlined /> : <PlusOutlined />}
        onClick={() => handleFollowClick(null)}
        />
      </div>
    </Tooltip>
  )
}

export default FollowButton;
