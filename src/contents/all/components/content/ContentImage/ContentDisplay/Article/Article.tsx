import React from 'react';
//import ContentImageMask from '../../ContentImageMask/ContentImageMask';
import ProgressiveImage from '../../../../common/ProgressiveImage';

import { Content } from '../../../../../global/types';

import './Article.scss';

interface Props {
  content: Content
  noMask?: boolean
}

// {!noMask && <ContentImageMask content={content} /> }

const Article = ({ content, noMask }: Props) => (
  <div className="article">
    <ProgressiveImage
      alt={content.title}
      image={content.image}
      placeholderImage={content.placeholderImage}
    />
  </div>
)

export default Article;
