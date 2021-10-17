import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

const MediaInfoBar = () => {
  const dispath = useDispatch();
  const mediaDetails = useSelector((state) => state.mediaDetails);
  const { media } = mediaDetails;

  const reviewDetails = useSelector((state) => state.reviewDetails);
  const { review } = reviewDetails;

  return (
    <>
      <div
        style={{
          borderRadius: '0.25rem',
          border: '1px solid #303030',
          marginBottom: '10px',
        }}
      >
        <span
          className='material-icons-round'
          style={{
            fontSize: '20px',
            transform: 'translate(2px, 3px)',
            color: '#375A7F',
          }}
        >
          theaters
        </span>
        {review && media && (
          <>
            &nbsp;
            <span className='badge bg-secondary' style={styleTransform}>review: {review.reviewName}</span>
            &nbsp;
            <span className='badge bg-primary' style={styleTransform}>media: {media.mediaName}</span>
            &nbsp;
            <span className='badge bg-success' style={styleTransform}>
              version: {String(media.version).padStart(4, '0')}
            </span>
          </>
        )}
      </div>
    </>
  );
};

const styleTransform = {
  transform: 'translate(0px, -2px)',
};

export default MediaInfoBar;
