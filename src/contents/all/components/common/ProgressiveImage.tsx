import React from 'react'
import ProgressiveImage from 'react-progressive-image';

import placeholder_1x1 from '../../assets/img/placeholders/placeholder_1x1.jpg';
import placeholder_2x3 from '../../assets/img/placeholders/placeholder_2x3.jpg';
import placeholder_16x9 from '../../assets/img/placeholders/placeholder_16x9.jpg';

const ratioPlaceholders = {
  '1x1': placeholder_1x1,
  '2x3': placeholder_2x3,
  '16x9': placeholder_16x9,
}

const ProgressiveImg = props => {

  const { alt, ratio, className, noBlur, image, placeholderImage } = props;

  const defaultPlaceholder = ratio ? ratioPlaceholders[ratio] : ratioPlaceholders['1x1']

  return (
    <ProgressiveImage
      src={image || defaultPlaceholder}
      placeholder={placeholderImage || defaultPlaceholder}
    >
      {(src, loading) => (
        <img
          className={loading
            ? `${className || ""} ${noBlur ? "" : "blur"}`
            : `${className || ""} ${noBlur ? "" : "unblur"}`
          }
          src={src}
          alt={alt}
        />
      )}
    </ProgressiveImage>
  )
}

export default ProgressiveImg
