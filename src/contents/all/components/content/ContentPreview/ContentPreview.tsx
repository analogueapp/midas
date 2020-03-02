import React from 'react';

import './ContentPreview.scss'

const ContentPreviewHeader = props => {
  if (props.content) {
    return (
      <a
        target="_blank"
        className="contentPreviewWrapper"
        href={`http://localhost:3000/${props.content.formSlug}/${props.content.slug}`}
      >
        <div className="contentPreview">

          <div className="imgWrapper">
            <img className="blur" src={`http://localhost:3001/${props.content.imageUrl}?s=${props.content.formDisplay === "film" || props.content.formDisplay === "book" ? "full" : "medium"}`} alt={props.content.title} />
          </div>

          <h5 className="title">{props.content.title}</h5>

          <div className="details">
            {props.content.originUrl}
          </div>

        </div>
      </a>
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
