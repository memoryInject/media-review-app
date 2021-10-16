import React from 'react';
import { useSelector } from 'react-redux';
import { Image } from 'react-bootstrap';

const AnnotationImages = () => {
  const playerDetails = useSelector((state) => state.playerDetails);
  const { height, width, currentTime } = playerDetails;

  const feedbackList = useSelector((state) => state.feedbackList);
  const { feedbacks } = feedbackList;
  return (
    <>
      {feedbacks &&
        feedbacks.map((f, idx) => {
          if (
            f.mediaTime.toFixed(2) === currentTime.toFixed(2) &&
            f.annotationUrl
          ) {
            return (
              <Image
                key={idx}
                src={f.annotationUrl}
                style={{ height, width, position: 'absolute' }}
              />
            );
          }
          return <div key={idx} />;
        })}
    </>
  );
};

export default AnnotationImages;
