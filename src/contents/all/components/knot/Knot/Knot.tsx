import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import Moment from 'react-moment';
import { FaRegComment } from "react-icons/fa";
import { Timeline, Button, Popconfirm, DatePicker, Tooltip } from 'antd';
import { LockOutlined, UnlockOutlined, HeartOutlined, HeartFilled } from '@ant-design/icons';

import { Log, Like, Knot as KnotType } from '../../../global/types';

import KnotInput from '../KnotInput/KnotInput';
import NumberCount from '../../common/NumberCount'
import Responses from '../Responses/Responses'
import ResponseForm from '../Responses/ResponseForm'
import ResponseInput from '../Responses/ResponseInput'

import './Knot.scss';
import '../Trix.scss';

interface Props {
  log: Log
  knot: KnotType
  isLast: boolean
}

const Knot = ({ log, knot, isLast }: Props) => {

  const currentUser = useSelector(state => state.user);
  const isOwner = (currentUser.id == knot.user.id)

  const [edited, setEdited] = useState(false)
  const [loading, setLoading] = useState(false)
  const [hover, setHover] = useState(false)
  const [currentKnot, setCurrentKnot] = useState(knot)
  const [replyOpen, setReplyOpen] = useState(false)
  const [responseSubmitted, setResponseSubmitted] = useState(false)

  const [like, setLike] = useState<Like>(currentKnot.like)
  const [liked, setLiked] = useState(currentKnot.like ? true : false)
  const [likesCount, setLikesCount] = useState<number>(knot.likesCount)
  const [replyCount, setReplyCount] = useState<number>(
    knot.responses ?
    knot.responses.filter(response => response.body != null).length
    : 0
  )

  const knotRef = useRef(null)

  useEffect(() => {
    setCurrentKnot(knot)
    setReplyCount(knot.responses ?
    knot.responses.filter(response => response.body != null).length
    : 0)
  }, [knot])

  useEffect(() => {
    chrome.runtime.onMessage.addListener(messageListener)

    return () => {
      chrome.runtime.onMessage.removeListener(messageListener)
    }
  }, [like, liked, likesCount, replyOpen])

  const messageListener = (request, sender, sendResponse) => {
    if (request.message === "update_knot_likes_response") {
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

  const submitResponse = () => {
    setReplyOpen(false)
    setResponseSubmitted(true)
  }
  const hideReply = () => setReplyOpen(false)
  const toggleReply = () => setReplyOpen(!replyOpen)

  return (
    <Timeline.Item className={`knot ${isLast ? "ant-timeline-item-last" : ""}`}>
      <div
        ref={knotRef}
        onMouseOver={() => setHover(true)}
        onMouseOut={() => setHover(false)}
      >
        <div
          className={`knotCard ${knot.private ? "private" : ""}`}
          onClick={isOwner ? () => setEdited(true) : null}
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

        <div className={`knotMeta ${edited ? "edited" : ""}`}>
          <Button
            className="lockBtn"
            icon={knot.private ? <LockOutlined /> : <UnlockOutlined />}
            onClick={() => changePrivacy()}
            size={"small"}
          />

          <span className={`likeBtn ${liked ? "liked" : ""}`}>
            <Button
              icon={liked ? <HeartFilled /> : <HeartOutlined />}
              onClick={() => clickLike()}
              size="small"
            />

            {likesCount > 0 &&
              <span className="likeCount"><NumberCount count={likesCount} /></span>
            }
          </span>

          {replyCount > 0 &&
            <>
              <span className="responseIcon">
                <FaRegComment />
              </span>
              <NumberCount count={replyCount} />
            </>
          }


          <span
            className="reply"
            onClick={toggleReply}
          >
            Reply
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
          {isOwner &&
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
          }
        </div>
        {replyOpen &&
        <ResponseInput
          onClose={hideReply}
          className="newResponse"
          respondableId={knot.id}
          first={true}
        />
        }
        {knot.responses && knot.responses.length > 0 &&
        <Responses responses={knot.responses} log={log} />
        }
      </div>
    </Timeline.Item>
  )
}

export default Knot;
