import React, { useEffect } from 'react';
import { Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FEEDBACK_LIST_RESET } from '../constants/feedbackConstants';
import Loader from './Loader';
import Message from './Message';
import { seekToPlayer } from '../actions/playerActions';

const FeedbackList = () => {
  const dispatch = useDispatch();
  const feedbackList = useSelector((state) => state.feedbackList);

  const { loading, error, feedbacks } = feedbackList;

  useEffect(() => {
    dispatch(seekToPlayer(0.0));
  }, [dispatch, feedbacks]);

  const getTime = (seconds) => {
    const secToDate = new Date(seconds * 1000).toISOString();
    return `${secToDate.substr(14, 5)}:${secToDate.substr(20, 2)}`;
  };

  const seekToHandler = (time) => {
    dispatch(seekToPlayer(time));
  };

  return (
    <div
      className='scrollbar'
      id='style-1'
      style={{
        height: '99%',
        width: '100%',
        backgroundColor: '#303030',
        borderRadius: '.25rem',
        padding: '0.5rem',
        maxHeight: '78vh',
        overflow: 'auto',
      }}
    >
      <h5>Feedback</h5>
      {loading ? <Loader /> : error && <Message>{error}</Message>}
      {feedbacks &&
        feedbacks.map((f, idx) => (
          <Card
            key={idx}
            className='my-2'
            style={{
              backgroundColor: '#3A3A3A',
            }}
          >
            <Card.Body>
              <Card.Title>{f.user.username}</Card.Title>
              <Card.Subtitle
                className='mb-2 text-muted'
                style={{
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                }}
                onClick={() => seekToHandler(f.mediaTime)}
              >
                <span
                  className='material-icons-round'
                  style={{
                    fontSize: '16px',
                    position: 'relative',
                    top: '2px',
                  }}
                >
                  brush
                </span>
                {getTime(f.mediaTime)}
              </Card.Subtitle>
              <Card.Text>{f.content}</Card.Text>
            </Card.Body>
            <Card.Link
              href='#'
              className='text-end'
              style={{
                paddingRight: '0.6rem',
                paddingBottom: '0.2rem',
                textDecoration: 'none',
                fontSize: '14px',
              }}
            >
              REPLY
            </Card.Link>
          </Card>
        ))}
    </div>
  );
};

export default FeedbackList;
