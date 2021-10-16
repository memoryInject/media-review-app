import React, { useEffect, useRef } from 'react';
import { Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
  FEEDBACK_LIST_RESET,
  FEEDBACK_CREATE_RESET,
} from '../constants/feedbackConstants';
import Loader from './Loader';
import Message from './Message';
import { seekToPlayer } from '../actions/playerActions';

const FeedbackList = () => {
  const dispatch = useDispatch();

  const feedbackList = useSelector((state) => state.feedbackList);
  const { loading, error, feedbacks } = feedbackList;

  const feedbackCreate = useSelector((state) => state.feedbackCreate);
  let {
    loading: feedbackCreateLoading,
    error: feedbackCreateError,
    feedback: feedbackCreateSuccess,
  } = feedbackCreate;

  const playerDetails = useSelector((state) => state.playerDetails);
  const { height } = playerDetails;

  const cardFocus = useRef(null);

  useEffect(() => {
    if (feedbackCreateSuccess) {
      dispatch(seekToPlayer(feedbackCreateSuccess.mediaTime));
      if (cardFocus && cardFocus.current) {
        cardFocus.current.scrollIntoView();
      }
    } else {
      dispatch(seekToPlayer(0.0));
    }
  }, [dispatch, feedbacks, feedbackCreateSuccess]);

  const getTime = (seconds) => {
    const secToDate = new Date(seconds * 1000).toISOString();
    return `${secToDate.substr(14, 5)}:${secToDate.substr(20, 2)}`;
  };

  const getHeight = () => {
    return height ? `${height + 177}px` : '70vh';
  };

  const seekToHandler = (time) => {
    dispatch(seekToPlayer(time));
  };

  return (
    <div
      style={{
        backgroundColor: '#303030',
        borderRadius: '.25rem',
      }}
    >
      <h6
        style={{
          paddingLeft: '0.4rem',
          paddingTop: '0.3rem',
          color: '#888888',
        }}
      >
        Feedback
      </h6>
      <div
        className='scrollbar'
        id='style-1'
        style={{
          height: '99%',
          width: '100%',
          backgroundColor: '#303030',
          borderRadius: '.25rem',
          padding: '0.5rem',
          maxHeight: getHeight(),
          minHeight: getHeight(),
          overflow: 'auto',
          position: 'relative',
        }}
      >
        {loading ? <Loader /> : error && <Message>{error}</Message>}
        {feedbacks &&
          feedbacks.map((f, idx) => (
            <Card
              key={idx}
              className='my-2'
              style={{
                backgroundColor: `${
                  feedbackCreateSuccess && feedbackCreateSuccess.id === f.id
                    ? '#2C343A'
                    : '#3A3A3A'
                }`,
              }}
            >
              {feedbackCreateSuccess && feedbackCreateSuccess.id === f.id && (
                <span ref={cardFocus}></span>
              )}
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
                  {getTime(f.mediaTime)}
                  {f.annotationUrl && (
                    <span
                      className='material-icons-round'
                      style={{
                        fontSize: '16px',
                        position: 'relative',
                        top: '2px',
                        marginLeft: '4px',
                      }}
                    >
                      brush
                    </span>
                  )}
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
    </div>
  );
};

export default FeedbackList;
