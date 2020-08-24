import React from 'react';

import ProgressiveImage from '../common/ProgressiveImage';

import './ProfileImage.scss';

const ProfileImage = props => {
  return (
    <div className={`profileImage ${props.user.diedAt ? "goldscale" : ""} ${props.user.isActive && "isActive"}`}>

      <ProgressiveImage
        alt={props.user.name}
        noBlur={props.noBlur}
        image={props.user.image}
        placeholderImage={props.user.placeholderImage}
      />

      {props.user.isActive &&
        <div className="avatarHalo" />
      }
    </div>
  );
};

export default ProfileImage;
