import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { LoadingOutlined } from '@ant-design/icons';

import KeyboardShortcut from '../../common/KeyboardShortcut/KeyboardShortcut';

import { Response as ResponseType } from '../../../global/types';

import './ResponseForm.scss';

interface Props {
  response?: ResponseType
  className?: string
  parentId?: number
  respondableId?: number
  onSubmit?: () => void
  onClose?: () => void
}

const ResponseForm = ({
  response,
  className,
  parentId,
  respondableId,
  onSubmit,
  onClose
}: Props) => {

  const currentUser = useSelector(state => state.user);

  const [loading, setLoading] = useState(false)
  const [body, setBody] = useState<string>(response? response.body : '')

  const handleSubmit = () => {
    if (!body) { return }

    setLoading(true)

    if (response) {
      chrome.runtime.sendMessage({
        message: "update_response",
        response: response,
        body: body
      })
    } else {
      chrome.runtime.sendMessage({
        message: "create_response",
        respondableId: respondableId,
        parentId: parentId,
        body: body
      })
    }
  };

  const handleChange = value => setBody(value)

  return (
    <div className={`responseForm ${className ? className: ""}`}>

      <div className={`submitButton ${body.length > 0 ? 'show' : ''}`}>
        {loading
          ? <LoadingOutlined />
          : (
            <KeyboardShortcut
              onClick={handleSubmit}
              text={response ? "Save" : "Post"}
              keys={['CMD', 'ENTER']}
            />
          )
        }
      </div>
    </div>
  )
}

export default ResponseForm;
