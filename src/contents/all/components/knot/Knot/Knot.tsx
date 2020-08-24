import React, { useState, useEffect, useRef } from 'react';
import Moment from 'react-moment';
import { Timeline, Button, Popconfirm, DatePicker, Tooltip } from 'antd';
import { LockOutlined, UnlockOutlined, HeartOutlined, HeartFilled } from '@ant-design/icons';

import { Log, Like, Knot as KnotType } from '../../../global/types';

import KnotInput from '../KnotInput/KnotInput';
import NumberCount from '../../common/NumberCount'

import './Knot.scss';
import '../Trix.scss';

interface Props {
  log: Log
  knot: KnotType
  isLast: boolean
}

const Knot = ({ log, knot, isLast }: Props) => {

  const [edited, setEdited] = useState(false)
  const [hover, setHover] = useState(false)
  const [currentKnot, setCurrentKnot] = useState(knot)
  const [like, setLike] = useState<Like>(currentKnot.like)
  const [liked, setLiked] = useState(currentKnot.like ? true : false)
  const [likesCount, setLikesCount] = useState<number>(knot.likesCount)

  const knotRef = useRef(null)

  useEffect(() => {
    setCurrentKnot(knot)
  }, [knot])

  useEffect(() => {
    chrome.runtime.onMessage.addListener(messageListener)

    return () => {
      chrome.runtime.onMessage.removeListener(messageListener)
    }
  }, [like, liked, likesCount, replyOpen])

  const messageListener = (request, sender, sendResponse) => {
    if (request.message === "update_knot_likes_response") {
      console.log("response", request)
      setLoading(false)
      if (request.like) {setLike(request.body.like)}
      else {setLike(null)}
      chrome.runtime.sendMessage({ message: "get_knots", log: log })
    }

    if (request.message === "create_response_response") {
      chrome.runtime.sendMessage({ message: "get_knots", log: log })
      hideReply()
    }


  }

  const submitForm = values => {
    chrome.runtime.sendMessage({
      message: "auth_user",
      user: { ...values }
    })
  }

  const deleteKnot = () => {
    chrome.runtime.sendMessage({
      message: "delete_knot",
      log: log,
      knot: knot
    })
  }

  const changePrivacy = () => {
    chrome.runtime.sendMessage({
      message: "edit_knot",
      knot: {...knot, private: !knot.private}
    })
  }

  const clickLike = () => {
    setLoading(true)

    if (like) {
      setLiked(false)
      setLikesCount(likesCount - 1)
    } else {
      setLiked(true)
      setLikesCount(likesCount + 1)
    }
    chrome.runtime.sendMessage({
      message: "update_knot_likes",
      knot: knot,
      like: like,
      liked: !liked
    })
  }
  return (
    <Timeline.Item className={`knot ${isLast ? "ant-timeline-item-last" : ""}`}>
      <div
        ref={knotRef}
        onMouseOver={() => setHover(true)}
        onMouseOut={() => setHover(false)}
      >
        <div
          className={`knotCard ${knot.private ? "private" : ""}`}
          onClick={() => setEdited(true)}
        >
          {edited
            ? (
              <KnotInput
                setEdited={setEdited}
                setKnot={setCurrentKnot}
                knot={knot}
              />
            )
            : <div className="trix-content" dangerouslySetInnerHTML={{__html: currentKnot.body}} />
          }
        </div>
        <div className="knotMeta">
          <Button icon={knot.private ? <LockOutlined /> : <UnlockOutlined />}
          onClick={() => changePrivacy()}
          size={"small"} />

          <span className={`likeBtn ${liked ? "liked" : ""}`}>
            <Button
            icon={liked ? <HeartFilled /> : <HeartOutlined />}
            onClick={() => clickLike()}
            size={"small"}
            />

            {likesCount > 0 &&
              <span className="likeCount"><NumberCount count={likesCount} /></span>
            }
          </span>
          <Moment
            filter={(value) =>
              value.replace(/^a few seconds ago/g, 'just now')
              .replace(/^a /g, '1 ')
              .replace(/^an /g, '1 ')
              .replace("minute", 'min')
            }
            fromNow
          >
            {knot.postedAt}
          </Moment>
          {knot.updatedAt != knot.postedAt &&
            <span className="edited">
              edited{' '}
              <Moment
                filter={(value) =>
                  value.replace(/^a few seconds ago/g, 'just now')
                  .replace(/^a /g, '1 ')
                  .replace(/^an /g, '1 ')
                  .replace("minute", 'min')
                }
                fromNow
              >
                {knot.updatedAt}
              </Moment>
            </span>
          }
          <Popconfirm
            placement="top"
            title="Delete note?"
            okText="Delete"
            okType="default"
            arrowPointAtCenter
            overlayClassName="deleteConfirm"
            getPopupContainer={() => knotRef.current}
            icon={null}
            onConfirm={deleteKnot}
          >
            <span className={`delete ${hover ? 'show' : ''}`}>Delete</span>
          </Popconfirm>
        </div>
      </div>
    </Timeline.Item>
  )
}

export default Knot;
