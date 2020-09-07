import React, { useState } from 'react';
import Moment from 'react-moment';
import { Link, BrowserRouter, StaticRouter } from 'react-router-dom';
import { Timeline } from 'antd';

import ProfileAvatar from '../Profile/ProfileAvatar';
import ContentImage from '../content/ContentImage/ContentImage';
import FollowButton from '../Profile/FollowButton/FollowButton';
import Knot from '../knot/Knot/Knot';
import Responses from '../knot/Responses/Responses';
import PrimerItem from '../primer/PrimerItem/PrimerItem';

import './ActivityItem.scss';

export const verbWords = {
  Like: 'liked',
  Response: 'replied to',
  Log: 'added',
  Follow: 'started following',
  Mention: 'mentioned',
  Add: 'added'
}

export const objectWords = {
  Knot: 'your note',
  Response: 'your response',
  Content: 'from you',
  User: 'you',
  Mention: 'you in a response',
  Primer: 'to your collection'
}

interface Props {
  activity: any
  activityData: any
}

const rootUrl = process.env.NODE_ENV === 'production' ? 'https://www.analogue.app' : 'http://localhost:3000'

const ActivityItem = ({ activity, activityData }: Props) => {

  const [isRead, setIsRead] = useState<boolean>(activityData.is_read)

  const markAsRead = () => {
    if (!isRead) {
      chrome.runtime.sendMessage({ message: "read_activity", activityData: activityData})
      setIsRead(true)
    }
  }

  const showContentLink = activity.activity.verb === "Add" || (activity.activity.verb === "Log" && activity.log && activity.log.content)

  return (
    <Timeline.Item
      className={`activityItem ${activity.activity.verb === "Follow" ? "follow" : ""} ${isRead ? "" : "isUnread"}`}
    >
      <div onClick={markAsRead} onMouseOver={markAsRead}>
        <div className="activityContent">
          <p className="timelineDetail">

            <ProfileAvatar user={activity.user} />

            {activityData.actor_count > 1 &&
              <span>{" and "}
                <span className="aggregated">{`${activityData.actor_count - 1} other${activityData.actor_count - 1 === 1 ? "": "s"}`}</span>
              </span>
            }
            {activity.activity.notify_owner
              ? " replied in your note"
              : `  ${verbWords[activity.activity.verb]} ${activity.activity.verb === "Mention" ? objectWords["Mention"] : objectWords[activity.objectType]}`
            }
            {showContentLink &&
              <a
                target='_blank'
                className="contentLink"
                href={`${rootUrl}/${activity.log.content.formSlug}/${activity.log.content.slug}/@${activity.log.user.username}`}
              >
                {activity.log.content.title}
              </a>
            }

            {activity.activity.verb === "Add" && activity.primer &&
              <a
                target='_blank'
                href={`${rootUrl}/collection/${activity.primer.slug}`}
              >
                <PrimerItem primer={activity.primer} />
              </a>
            }
          </p>

          <div className="activityTime">
            <Moment
              filter={(value) =>
                value.replace(/^a few seconds ago/g, 'just now')
                .replace(/^a /g, '1 ')
                .replace(/^an /g, '1 ')
                .replace("minute", 'min')
              }
              fromNow
            >
              {`${activityData.updated_at}Z`}
            </Moment>
          </div>
        </div>

        <div className="activityAction">
          {activity.activity.verb === "Follow"
            ? <FollowButton profile={activity.user} />
            : (
              <div className="imgWrapper">
                <a
                  target='_blank'
                  href={`${rootUrl}/${activity.log.content.formSlug}/${activity.log.content.slug}/@${activity.log.user.username}`}
                >
                  <ContentImage noMask content={activity.log.content} />
                </a>
              </div>
            )
          }
        </div>

        {activity.objectType === "Knot" &&
          <div className="activityObject">
            <Knot
              knot={{
                ...activity.object,
                responses: activity.response ? [activity.response] : []
              }}
              log={activity.log}
              isLast={false}
            />
          </div>
        }

        {activity.objectType === "Response" &&
          <div className="activityObject">
            {activity.response
              ? (
                <Responses
                  responses={[{
                    ...activity.object,
                    responses: activity.object.responses && activity.object.responses.length > 0
                      ? [
                        ...activity.object.responses,
                        activity.response
                      ]
                      : [activity.response]
                  }]}
                  log={activity.log}
                />
              )
              : <Responses responses={[activity.object]} log={activity.log} />
            }
          </div>
        }
      </div>
    </Timeline.Item>
  );
}

export default ActivityItem;
