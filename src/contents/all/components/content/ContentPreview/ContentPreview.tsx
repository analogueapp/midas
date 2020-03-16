import React from 'react';

import ProgressiveImage from 'react-progressive-image';
import placeholderImg from '../../../assets/img/placeholders/placeholder_1x1.jpg';

import ContentMedium from '../ContentMedium/ContentMedium';

import './ContentPreview.scss'

const ContentPreviewHeader = props => {
  if (props.content) {
    return (
      <div className="contentPreviewWrapper">
        <a
          target="_blank"
          className="contentPreview"
          href={`${process.env.NODE_ENV === 'production' ? 'https://www.analogue.app' : 'http://localhost:3000'}/${props.content.formSlug}/${props.content.slug}`}
        >
          <div className="imgWrapper">
            <ProgressiveImage
              src={`${process.env.NODE_ENV === 'production' ? 'https://www.analogue.app' : 'http://localhost:3001'}/${props.content.imageUrl}?s=${props.content.formDisplay === "film" || props.content.formDisplay === "book" ? "full" : "medium"}`}
              placeholder={placeholderImg}
            >
              {(src, loading) => (
                <img className={loading ? "" : "blur"} src={src} alt={props.content.title} />
              )}
            </ProgressiveImage>
          </div>

          <h5 className="title">{props.content.title}</h5>

          <div className="details">
            <ContentMedium content={props.content} />
          </div>
        </a>
      </div>
    )
  }
  return (
    <div className="contentPreviewWrapper">
      <div className="contentPreview loading">
        <div className="imgWrapper" />
        <h5 className="title" />
        <div className="details" />
      </div>
    </div>
  )
}

export default ContentPreviewHeader;
