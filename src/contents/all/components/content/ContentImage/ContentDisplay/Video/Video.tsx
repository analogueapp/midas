import React from 'react';
//import ReactPlayer from 'react-player';
//import { Modal, Button } from 'antd';

//import ContentImageMask from '../../ContentImageMask/ContentImageMask';
import ProgressiveImage from '../../../../common/ProgressiveImage';

import { Content } from '../../../../../global/types';

import './Video.scss';

interface Props {
  content: Content
  isFilm?: boolean
  noMask?: boolean
}

// {content.mediaUrl && <PlayButton onClick={toggleModal} /> }

const Video = ({ content, isFilm, noMask }: Props) => {

  return (
    <div className={isFilm ? "video film" : "video"}>
      <ProgressiveImage
        ratio={isFilm ? "2x3" : "1x1"}
        alt={content.title}
        image={content.image}
        placeholderImage={content.placeholderImage}
      />
    </div>
  )
}

export default Video;
