import React from 'react';

//import ContentImageMask from '../../ContentImageMask/ContentImageMask'
import ProgressiveImage from '../../../../common/ProgressiveImage'

import { Content } from '../../../../../global/types';

import './Audio.scss';

interface Props {
  content: Content
  noMask?: boolean
}

// {!noMask && <ContentImageMask content={content} /> }

const Audio = ({ content, noMask }: Props) => {

  return (
    <div className="audio">
      <ProgressiveImage
        alt={content.title}
        image={content.image}
        placeholderImage={content.placeholderImage}
      />
    </div>
  )
}

export default Audio;
