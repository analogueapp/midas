import React from 'react';
//import ContentImageMask from '../../ContentImageMask/ContentImageMask';
import ProgressiveImage from '../../../../common/ProgressiveImage';

import { Content } from '../../../../../global/types';

import './Book.scss';

interface Props {
  content: Content
  noMask?: boolean
}

// {!noMask && <ContentImageMask content={content} /> }

const Book = ({ content, noMask }: Props) => (
  <div className="book">
    <ProgressiveImage
      ratio="2x3"
      alt={content.title}
      image={content.image}
      placeholderImage={content.placeholderImage}
    />
  </div>
)

export default Book;
