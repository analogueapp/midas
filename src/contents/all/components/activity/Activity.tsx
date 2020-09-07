import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'

import { LoadingOutlined } from '@ant-design/icons';
import ActivityItem from './ActivityItem';

import './Activity.scss';

const Activity = () => {

  const currentUser = useSelector(state => state.user);
  const [loading, setLoading] = useState(true)
  const [activity, setActivity] = useState(null)

  useEffect(() => {
    loadActivity()
  }, [])

  useEffect(() => {
    chrome.runtime.onMessage.addListener(messageListener)

    return () => {
      chrome.runtime.onMessage.removeListener(messageListener)
    }
  }, [loading, activity])

  const messageListener = (request, sender, sendResponse) => {
    if (request.message === "get_activity_response") {
      setLoading(false)
      setActivity(request.body)
    }
  }

  // useEffect(() => {
  //   if (activity.reload) { loadActivity() }
  // }, [activity.reload])

  const loadActivity = () => {
    chrome.runtime.sendMessage({ message: "get_activity"})
  }

  if (!loading && activity != null) {
    if (activity.activities) {
      if (activity.activities.length === 0) {
        return <p style={{ fontSize: '16px' }}>No recent activity</p>
      }
      return (
        <div className='activityTimeline'>
          {activity.activities.map((activityGroup) => {
            return (
              <ActivityItem
                key={activityGroup.activityData.id}
                activity={activityGroup.activities[0]}
                activityData={activityGroup.activityData}
              />
            )
          })}
        </div>
      )
    }
  }
  return <LoadingOutlined />
}

export default Activity;
