import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ListGroup } from 'react-bootstrap';

const Playlist = () => {
  const dispath = useDispatch();
  const mediaDetails = useSelector((state) => state.mediaDetails);
  const { media } = mediaDetails;

  const reviewDetails = useSelector((state) => state.reviewDetails);
  const { review } = reviewDetails;
  return (
    <>
      <ListGroup horizontal='md'>
        {review.media.map((m, idx) => (
          <ListGroup.Item
            style={{ minHeight: '6rem' }}
            key={idx}
            action
            onClick={() => mediaHandler(m)}
          >
            {m.mediaName}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </>
  );
};

export default Playlist;
