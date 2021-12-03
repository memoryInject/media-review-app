import React, { useState, useEffect, useRef } from 'react';
import { Card, Row, Col, Spinner, Image } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import getFormattedFeedbacks from '../utils/getFormattedFeedbacks';
import isCollaborator from '../utils/isCollaborator';
import Message from './Message';
import ModalDialog from './ModalDialog';

import { showToast, messageToast, variantToast } from '../actions/toastActions';
import { seekToPlayer } from '../actions/playerActions';
import {
  deleteFeedback,
  listFeedbacks,
  replyFeedback,
} from '../actions/feedbackActions';
import {
  FEEDBACK_ACTIVE_RESET,
  FEEDBACK_TO_UPDATE,
  FEEDBACK_REPLY_RESET,
  FEEDBACK_TO_UPDATE_RESET,
  FEEDBACK_TO_DELETE,
  FEEDBACK_DELETE_RESET,
} from '../constants/feedbackConstants';

const FeedbackList = () => {
  const dispatch = useDispatch();

  const feedbackList = useSelector((state) => state.feedbackList);
  const {
    loading,
    error,
    feedbacks,
    active,
    height: feedbackListHeight,
  } = feedbackList;

  const mediaDetails = useSelector((state) => state.mediaDetails);
  let { media } = mediaDetails;

  const userDetails = useSelector((state) => state.userDetails);
  const { user } = userDetails;

  const reviewDetails = useSelector((state) => state.reviewDetails);
  let { review } = reviewDetails;

  const feedbackCreate = useSelector((state) => state.feedbackCreate);
  let { feedback: feedbackCreateSuccess } = feedbackCreate;

  const feedbackDelete = useSelector((state) => state.feedbackDelete);
  let {
    loading: feedbackDeleteLoading,
    error: feedbackDeleteError,
    success: feedbackDeleteSuccess,
    delete: feedbackToDelete,
  } = feedbackDelete;

  //const playerDetails = useSelector((state) => state.playerDetails);
  //const { height, videoSize } = playerDetails;

  const cardFocus = useRef(null);

  const [delay, setDelay] = useState(false);

  const [formattedFeedbacks, setFormattedFeedbacks] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (feedbackCreateSuccess) {
      dispatch(seekToPlayer(feedbackCreateSuccess.mediaTime));
      dispatch(seekToPlayer(-1));
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

  // setup a short delay for showing feedbacks, it improve UI/UX by not showing,
  // cached feedbacks when this componet first loads
  useEffect(() => {
    let timer1 = setTimeout(() => setDelay(true), 100);
    return () => clearTimeout(timer1);
  }, [feedbacks]);

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
      dispatch(messageToast('Feedback successfully deleted.'));
      dispatch(variantToast('success'));
      dispatch(showToast(true));
      dispatch(listFeedbacks(media.id));
    }
  }, [feedbackDeleteSuccess, media, dispatch]);

  const getTime = (seconds) => {
    const secToDate = new Date(seconds * 1000).toISOString();
    return `${secToDate.substr(14, 5)}:${secToDate.substr(20, 2)}`;
  };

  // This will calculate the hight of the feedback list
  const getHeight = () => {
    return feedbackListHeight ? `${feedbackListHeight + 43}px` : `100%`;
  };

  //const getHeight = () => {
  //return height
  //? `${height + 243}px`
  //: videoSize
  //? `${Math.ceil(videoSize.height * videoSize.scaleFactor) + 243 + 6}px`
  //: `${80 + 243}px`;
  //};

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
        height: '99%',
      }}
    >
      <Row>
        <Col>
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
        </Col>
        <Col className='d-flex flex-row-reverse'>
          {(loading || feedbackDeleteLoading) && (
            <Spinner
              animation='grow'
              role='status'
              style={{
                //margin: 'auto',
                height: '20px',
                width: '20px',
                display: 'block',
              }}
              className='m-2 text-muted'
            >
              <span className='visually-hidden'>Loading...</span>
            </Spinner>
          )}
        </Col>
      </Row>

      <div
        className='scrollbar'
        id='style-1'
        style={{
          //height: '99%',
          width: '100%',
          backgroundColor: '#303030',
          borderRadius: '.25rem',
          padding: '0.5rem',
          maxHeight: getHeight(),
          //minHeight: getHeight(),
          overflow: 'auto',
          position: 'relative',
          //transition: 'all 0.1s ease-in-out',
        }}
      >
        {error && <Message>{error}</Message>}
        {feedbackDeleteError && <Message>{feedbackDeleteError}</Message>}

        {/*If there is no feedback in the media*/}
        {feedbacks && !feedbacks.length && media && (
          <div className='text-center text-muted m-2 p-2'>
            <span className='material-icons-round'>announcement</span>
            <h6>There is no feedbacks yet.</h6>
          </div>
        )}

        {delay &&
          feedbacks &&
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
                <Row sm='auto'>
                  <Col className='align-self-center'>
                    {f.user.profile.imageUrl && (
                      <Image
                        src={f.user.profile.imageUrl}
                        roundedCircle
                        style={{
                          height: '32px',
                          position: 'relative',
                          top: '-5px',
                        }}
                      />
                    )}
                  </Col>
                  <Col className='px-0'>
                    <Card.Title className='h6 text-light'>
                      {f.user.username}
                    </Card.Title>
                    <Card.Subtitle
                      className='text-muted mb-2'
                      style={{
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        position: 'relative',
                        top: '-3px',
                      }}
                      onClick={() => seekToHandler(f)}
                    >
                      {f.annotationUrl && (
                        <span
                          className='material-icons-round'
                          style={{
                            fontSize: '16px',
                            position: 'relative',
                            top: '2px',
                            marginRight: '2px',
                            marginLeft: '-1px',
                          }}
                        >
                          brush
                        </span>
                      )}
                      {getTime(f.mediaTime)}
                    </Card.Subtitle>
                  </Col>
                </Row>
                <Card.Text>{f.content}</Card.Text>
              </Card.Body>
              <Row>
                {user && user.id === f.user.id && (
                  <Col>
                    <span
                      data-cy={`feedback-${idx}-edit`}
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
                      data-cy={`feedback-${idx}-delete`}
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
                      data-cy={`feedback-${idx}-reply`}
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
    </div>
  );
};

export default FeedbackList;
