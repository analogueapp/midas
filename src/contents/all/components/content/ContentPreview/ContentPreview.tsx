import React from 'react';
import { Skeleton } from 'antd';

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
    <div className="contentPreview">
      <Skeleton avatar active paragraph={{ rows: 0 }} />
    </div>
  )
}

export default ContentPreviewHeader;
