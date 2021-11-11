import React, { useState, useEffect, useRef } from 'react';
import { Card, Row, Col, ToastContainer, Toast } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import getFormattedFeedbacks from '../utils/getFormattedFeedbacks';
import isCollaborator from '../utils/isCollaborator';
import Loader from './Loader';
import Message from './Message';
import ModalDialog from './ModalDialog';

import { seekToPlayer } from '../actions/playerActions';
import {
  activeFeedback,
  deleteFeedback,
  listFeedbacks,
  replyFeedback,
} from '../actions/feedbackActions';
import {
  FEEDBACK_LIST_RESET,
  FEEDBACK_CREATE_RESET,
  FEEDBACK_ACTIVE_RESET,
  FEEDBACK_TO_UPDATE,
  FEEDBACK_REPLY_RESET,
  FEEDBACK_TO_UPDATE_RESET,
  FEEDBACK_TO_DELETE,
  FEEDBACK_DELETE_RESET,
  FEEDBACK_TO_DELETE_RESET,
} from '../constants/feedbackConstants';

const FeedbackList = () => {
  const dispatch = useDispatch();

  const feedbackList = useSelector((state) => state.feedbackList);
  const { loading, error, feedbacks, active } = feedbackList;

  const mediaDetails = useSelector((state) => state.mediaDetails);
  let { media } = mediaDetails;

  const userDetails = useSelector((state) => state.userDetails);
  const { user } = userDetails;

  const reviewDetails = useSelector((state) => state.reviewDetails);
  let { review } = reviewDetails;

  const feedbackCreate = useSelector((state) => state.feedbackCreate);
  let {
    loading: feedbackCreateLoading,
    error: feedbackCreateError,
    feedback: feedbackCreateSuccess,
  } = feedbackCreate;

  const feedbackDelete = useSelector((state) => state.feedbackDelete);
  let {
    loading: feedbackDeleteLoading,
    error: feedbackDeleteError,
    success: feedbackDeleteSuccess,
    delete: feedbackToDelete,
  } = feedbackDelete;

  const playerDetails = useSelector((state) => state.playerDetails);
  const { height, videoSize } = playerDetails;

  const cardFocus = useRef(null);

  const [formattedFeedbacks, setFormattedFeedbacks] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (feedbackCreateSuccess) {
      dispatch(seekToPlayer(feedbackCreateSuccess.mediaTime));
    } else {
      dispatch(seekToPlayer(0.0));
    }

    if (feedbacks) {
      setFormattedFeedbacks(getFormattedFeedbacks(feedbacks));
    }
  }, [dispatch, feedbacks, feedbackCreateSuccess]);

  useEffect(() => {
    if (cardFocus && cardFocus.current) {
      cardFocus.current.scrollIntoView();
    }
  }, [formattedFeedbacks, active]);

  // Run this after the confirm from ModelDialog
  useEffect(() => {
    if (confirmDelete && feedbackToDelete) {
      dispatch(deleteFeedback(feedbackToDelete.id));
      setConfirmDelete(false);
    }
  }, [confirmDelete, feedbackToDelete, dispatch]);

  // Run this after the feedback delete is successful
  useEffect(() => {
    if (feedbackDeleteSuccess && media) {
      dispatch({ type: FEEDBACK_DELETE_RESET });
      dispatch(listFeedbacks(media.id));
      setShowToast(true);
    }
  }, [feedbackDeleteSuccess, media, dispatch]);

  const getTime = (seconds) => {
    const secToDate = new Date(seconds * 1000).toISOString();
    return `${secToDate.substr(14, 5)}:${secToDate.substr(20, 2)}`;
  };

  // This will calculate the hight of the feedback list
  const getHeight = () => {
    return height
      ? `${height + 243}px`
      : videoSize
      ? `${Math.ceil(videoSize.height * videoSize.scaleFactor) + 243 + 6}px`
      : `${80 + 243}px`;
  };

  const seekToHandler = (feedback) => {
    dispatch(seekToPlayer(feedback.mediaTime));
    dispatch({ type: FEEDBACK_ACTIVE_RESET });
  };

  const replyHandler = (feedbackToReplay) => {
    dispatch(replyFeedback(feedbackToReplay));
    dispatch({ type: FEEDBACK_TO_UPDATE_RESET });
    seekToHandler(feedbackToReplay);
  };

  const updateFeedbackHandler = (feedback) => {
    dispatch({ type: FEEDBACK_TO_UPDATE, payload: feedback });
    dispatch({ type: FEEDBACK_REPLY_RESET });
    seekToHandler(feedback);
  };

  const confirmDeleteHandler = () => {
    setConfirmDelete(true);
  };

  const deleteFeedbackHandler = (feedback) => {
    dispatch({ type: FEEDBACK_TO_DELETE, payload: feedback });
    setShowModal(true);
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
          paddingLeft: '0.7rem',
          paddingTop: '0.0rem',
          color: '#888888',
        }}
        className='text-start'
      >
        <span
          className='material-icons-round'
          style={{ transform: 'translate(-5px, 8px)' }}
        >
          chat
        </span>
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
          transition: 'all 0.5s ease-in-out',
        }}
      >
        {loading || feedbackDeleteLoading ? (
          <Loader />
        ) : (
          error && <Message>{error}</Message>
        )}
        {feedbackDeleteError && <Message>{feedbackDeleteError}</Message>}
        {feedbacks &&
          formattedFeedbacks.map((f, idx) => (
            <Card
              key={idx}
              className='my-2'
              style={{
                backgroundColor: `${
                  active && active.id === f.id ? '#2C343A' : '#3A3A3A'
                }`,
                marginLeft: `${f.depth * 5}%`,
              }}
            >
              {active && active.id === f.id && <span ref={cardFocus}></span>}
              <Card.Body>
                <Card.Title>{f.user.username}</Card.Title>
                <Card.Subtitle
                  className='mb-2 text-muted'
                  style={{
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                  }}
                  onClick={() => seekToHandler(f)}
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
              <Row>
                {user && user.id === f.user.id && (
                  <Col>
                    <span
                      className='material-icons-round text-light feed-edit'
                      style={{
                        transform: 'translate(8px, 0px)',
                        cursor: 'pointer',
                      }}
                      onClick={() => updateFeedbackHandler(f)}
                    >
                      edit_note
                    </span>
                    <span
                      className='material-icons-round text-light feed-del'
                      style={{
                        transform: 'translate(8px, 0px)',
                        cursor: 'pointer',
                      }}
                      onClick={() => deleteFeedbackHandler(f)}
                    >
                      delete_forever
                    </span>
                  </Col>
                )}
                <Col className='text-end'>
                  {user && review && isCollaborator(user, review) && (
                    <Card.Link
                      href='#'
                      style={{
                        paddingRight: '0.6rem',
                        paddingLeft: '0.6rem',
                        textDecoration: 'none',
                        fontSize: '14px',
                      }}
                      onClick={() => replyHandler(f)}
                    >
                      REPLY
                    </Card.Link>
                  )}
                </Col>
              </Row>
            </Card>
          ))}
      </div>

      {/*Confirm dialog for feedback delete*/}
      <ModalDialog
        title='Delete Feedback'
        content={'This will delete the feedback forever!'}
        state={showModal}
        stateCallback={setShowModal}
        callback={confirmDeleteHandler}
      />

      {/*Feedback delete successful toast*/}
      <ToastContainer position='top-end' className='p-3'>
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3000}
          autohide
          bg='success'
        >
          <Toast.Header>
            <span className='material-icons-round'>movie</span>
            <strong className='me-auto'>&nbsp;Media-Review</strong>
            <small className='text-muted'>just now</small>
          </Toast.Header>
          <Toast.Body>Feedback successfully deleted.</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

export default FeedbackList;
