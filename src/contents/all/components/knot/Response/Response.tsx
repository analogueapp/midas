import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Comment, Avatar, Button, Popconfirm } from 'antd';
import { LoadingOutlined, HeartFilled, HeartOutlined } from '@ant-design/icons';
import Moment from 'react-moment';
import Linkify from 'linkifyjs/react';
import * as linkify from 'linkifyjs'
import mention from 'linkifyjs/plugins/mention';

import ProfileAvatar from '../../Profile/ProfileAvatar';
import ResponseForm from '../Responses/ResponseForm';
import ResponseInput from '../Responses/ResponseInput';

import NumberCount from '../../common/NumberCount';

import { connect } from 'react-redux';

import { Response as ResponseType, Like, Log } from '../../../global/types';

import './Response.scss';

interface Props {
  response: ResponseType
  children?: React.ReactNode[]
  log: Log
}

const Response = ({
  response,
  children,
  log
}: Props) => {

  const currentUser = useSelector(state => state.user);

  const [loading, setLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const [hover, setHover] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [replyOpen, setReplyOpen] = useState(false)

  const [like, setLike] = useState<Like>(response.like)
  const [liked, setLiked] = useState(response.like ? true : false)
  const [likesCount, setLikesCount] = useState(response.likesCount)

  const responseRef = useRef(null)

  useEffect(() => {
    chrome.runtime.onMessage.addListener(messageListener)

    return () => {
      chrome.runtime.onMessage.removeListener(messageListener)
    }
  }, [like, liked, likesCount, loading])

  const messageListener = (request, sender, sendResponse) => {
    if (request.message === "update_response_likes_response") {
      console.log("response", request)
      setLoading(false)
      if (request.like) {setLike(request.body.like)}
      else {setLike(null)}
      chrome.runtime.sendMessage({ message: "get_knots", log: log })
    }

    if (request.message === "delete_response_response") {
      setDeleteLoading(false)
      setLoading(false)
      setLike(null)

      chrome.runtime.sendMessage({ message: "get_knots", log: log })
    }

    if (request.message === "create_response_response") {
      chrome.runtime.sendMessage({ message: "get_knots", log: log })
      setReplyOpen(false)
      setEditOpen(false)
    }

    if (request.message === "update_response_response") {
      chrome.runtime.sendMessage({ message: "get_knots", log: log })
      setReplyOpen(false)
      setEditOpen(false)
    }
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
      message: "update_response_likes",
      response: response,
      like: like,
      liked: !liked
    })
  }

  const hideReply = () => setReplyOpen(false)
  const toggleReply = () => setReplyOpen(!replyOpen)
  const toggleEdit = () => setEditOpen(!editOpen)

  const onMouseOver = () => setHover(true)
  const onMouseOut = () => setHover(false)

  const deleteResponse = () => {
    setDeleteLoading(true)
    setLoading(true)

    chrome.runtime.sendMessage({
      message: "delete_response",
      response: response
    })
  }

  const isOwner = currentUser && response.user && currentUser.username === response.user.username;
  const isDeleted = !response.user && !response.body;

  const replyBtn = currentUser || (currentUser && response.user && response.user.followBack)
    ? (
      <span
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
        onClick={toggleReply}
      >
        Reply
      </span>
    )
    : null

  const editBtn = isOwner
    ? (
      <span
        className={`ownerBtn ${hover ? 'show' : ''}`}
        onClick={toggleEdit}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
      >
        {editOpen ? '' : 'Edit'}
      </span>
    )
    : null;

  const deleteBtn = isOwner && !editOpen
    ? (
      <span
        className={`ownerBtn ${hover ? 'show' : ''}`}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
        ref={responseRef}
      >
        <Popconfirm
          title='Delete response?'
          okText='Delete'
          okType='default'
          overlayClassName='deleteConfirm'
          getPopupContainer={() => responseRef.current}
          icon={null}
          onConfirm={deleteResponse}
        >
          {deleteLoading ? <LoadingOutlined /> : 'Delete'}
        </Popconfirm>
      </span>
    )
    : null
//here
  return ( !isDeleted &&
    <Comment
      className='response'
      actions={[
        <span className={`likeBtn ${liked ? "liked" : ""}`}>
          <Button
          icon={liked ? <HeartFilled /> : <HeartOutlined />}
          onClick={() => clickLike()}
          size={"small"}
          />
          {likesCount > 0 &&
            <span className='likeCount'><NumberCount count={likesCount} /></span>
          }
        </span>,
        replyBtn,
        <span
          onMouseOver={onMouseOver}
          onMouseOut={onMouseOut}
          className='noHover'
        >
          <Moment
            filter={(value) =>
              value.replace(/^a few seconds/g, 'just now')
              .replace(/^a /g, '1 ')
              .replace(/^an /g, '1 ')
              .replace("minute", 'min')
            }
            fromNow ago
          >
            {response.createdAt}
          </Moment>
          {!isDeleted && response.updatedAt &&
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
                {response.updatedAt}
              </Moment>
            </span>
          }
        </span>,
        editBtn,
        deleteBtn,
      ]}
      author={
        <span
          onMouseOver={onMouseOver}
          onMouseOut={onMouseOut}
        >
        <ProfileAvatar
          user={response.user}
        />
        </span>
      }
      content={editOpen
          ? (
            <ResponseInput
              className="editResponse"
              response={response}
              onClose={hideReply}
            />
          )
          : (
            <p className='responseBody' onClick={() => isOwner ? setEditOpen(true) : null}>
              {response.body}
            </p>
          )
      }
    >
      {replyOpen &&
        <ResponseInput
          parentId={response.id}
          respondableId={response.respondableId}
          onClose={hideReply}
        />
      }
      {children &&
        <>
        {children.length > 1
          ? (
            <>
              {children[0]}
            </>
          )
          : children
        }
        </>
      }
    </Comment>
  )
}

export default Response;
