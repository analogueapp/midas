import React from 'react';
import Book from './ContentDisplay/Book/Book';
import Video from './ContentDisplay/Video/Video';
import Audio from './ContentDisplay/Audio/Audio';
import Article from './ContentDisplay/Article/Article';

import { Content } from '../../../global/types';

import './ContentImage.scss';

const contentType = {
  video: props => <Video {...props} />,
  film: props => <Video {...props} isFilm />,
  audio: props => <Audio {...props} />,
  book: props => <Book {...props} />,
  article: props => <Article {...props} />
}

interface Props {
  content: Content
  noMask?: boolean
}

const ContentImage = (props: Props) => (
  <div className="contentImage">
    {contentType[props.content.formDisplay](props)}
  </div>
)

export default ContentImage;
