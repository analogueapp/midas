import React from 'react';
import {
  AudioOutlined,
  CustomerServiceOutlined,
  PlayCircleOutlined,
  LinkOutlined
} from '@ant-design/icons';
import {
  FiFilm,
  FiBook,
  FiFileText,
  FiTv,
  FiFilter
} from "react-icons/fi";
import { FaSignature } from "react-icons/fa";

import './ContentMedium.scss';

export const mediumIcons = {
  all: <FiFilter />,

  // audio
  album: <CustomerServiceOutlined />,
  podcast: <AudioOutlined />,
  playlist: <CustomerServiceOutlined />,
  mixtape: <CustomerServiceOutlined />,
  single: <CustomerServiceOutlined />,
  song: <CustomerServiceOutlined />,
  'podcast episode': <AudioOutlined />,
  'audio link': <CustomerServiceOutlined />,

  // video
  film: <FiFilm />,
  tv: <FiTv className="tvIcon" />,
  'tv episode': <FiTv className="tvIcon" />,
  video: <PlayCircleOutlined />,
  'video link': <PlayCircleOutlined />,
  'video_link': <PlayCircleOutlined />,

  // text
  book: <FiBook />,
  'white paper': <FiFileText />,
  magazine: <FiFileText />,
  comic: <FiFileText />,
  manga: <FiFileText />,
  essay: <FiFileText />,
  link: <LinkOutlined />,

  // collections
  works: <FaSignature color="#c7ac75" className="worksIcon" />,
  podcasts: <AudioOutlined />,
  music: <CustomerServiceOutlined />,
  videos: <PlayCircleOutlined />,
  films: <FiFilm />,
  books: <FiBook />,
  comics: <FiFileText />,
  mangas: <FiFileText />,
  essays: <FiFileText />,
  links: <LinkOutlined />,
}

const ContentMedium = props => {
  let mediumKey = props.content.medium.split("_").join(" ");
  mediumKey = mediumKey === "episode" ? `${props.content.form} ${mediumKey}` : mediumKey

  return (
    <div className="contentMedium">
      <span>
        {mediumIcons[mediumKey]}
        {!props.noText &&
          <span className="text"> {props.content.mediumDisplay}</span>
        }
      </span>
    </div>
  )
}

export default ContentMedium
