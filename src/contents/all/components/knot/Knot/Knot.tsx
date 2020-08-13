import React, { useState, useEffect, useRef } from 'react';
import Moment from 'react-moment';
import { Timeline, Button, Popconfirm, DatePicker, Tooltip } from 'antd';
import { LockOutlined, UnlockOutlined } from '@ant-design/icons';

import { Log, Knot as KnotType } from '../../../global/types';

import KnotInput from '../KnotInput/KnotInput';

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

  const knotRef = useRef(null)

  useEffect(() => {
    setCurrentKnot(knot)
  }, [knot])

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
