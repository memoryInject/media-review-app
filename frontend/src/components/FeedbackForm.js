import React, { useState, useEffect, useRef } from 'react';
import { Button, Col, Form, Row, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import Message from './Message';
import isCollaborator from '../utils/isCollaborator';
import TranscriptModal from './TranscriptModal';

import {
  listFeedbacks,
  createFeedback,
  activeFeedback,
  updateFeedback,
} from '../actions/feedbackActions';

import {
  drawableTypeAnnotation,
  isEmptyAnnotation,
  setColorAnnotation,
  setActiveAnnotation,
} from '../actions/annotationActions';

import { showToast, messageToast, variantToast } from '../actions/toastActions';

import {
  ANNOTATION_IMAGE_EXPORT,
  ANNOTATION_IMAGE_RESET,
} from '../constants/annotationConstants';

import {
  FEEDBACK_REPLY_RESET,
  FEEDBACK_TO_UPDATE_RESET,
  FEEDBACK_HEIGHT_SET,
} from '../constants/feedbackConstants';

const FeedbackForm = () => {
  const formFeedback = useRef(null);
  const [feedback, setFeedback] = useState('');
  const [transcript, setTranscript] = useState('');
  const [showColorPalette, setShowColorPalette] = useState(false);
  const [showTranscriptModal, setShowTranscriptModal] = useState(false);

  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.userDetails);
  const { user } = userDetails;

  const reviewDetails = useSelector((state) => state.reviewDetails);
  let { review } = reviewDetails;

  const annotationDeatils = useSelector((state) => state.annotationDeatils);
  let { drawableType, color, active, image, isEmpty } = annotationDeatils;

  const mediaDetails = useSelector((state) => state.mediaDetails);
  let { media } = mediaDetails;

  const playerDetails = useSelector((state) => state.playerDetails);
  let { currentTime, height } = playerDetails;

  const feedbackCreate = useSelector((state) => state.feedbackCreate);
  let {
    loading: feedbackCreateLoading,
    error: feedbackCreateError,
    feedback: feedbackCreateSuccess,
    reply,
  } = feedbackCreate;

  const feedbackUpdate = useSelector((state) => state.feedbackUpdate);
  let {
    loading: feedbackUpdateLoading,
    error: feedbackUpdateError,
    feedback: feedbackUpdateSuccess,
    update,
  } = feedbackUpdate;

  // Update feedback list height info when player height changes
  useEffect(() => {
    const setFeedbackListHeight = () => {
      if (formFeedback && formFeedback.current) {
        const currentHeight =
          window.pageYOffset + formFeedback.current.getBoundingClientRect().top;
        dispatch({ type: FEEDBACK_HEIGHT_SET, payload: currentHeight });
      }
    };
    //setFeedbackListHeight();
    let timer1 = setTimeout(() => setFeedbackListHeight());
    return () => clearTimeout(timer1);
  }, [dispatch, height]);

  // Run this if there is an annotaion exists
  useEffect(() => {
    if (image && image.url) {
      if (reply) {
        // Create a reply with annotaion image
        dispatch(
          createFeedback({
            media: media.id,
            content: feedback,
            mediaTime: currentTime,
            annotationUrl: image.url,
            parent: reply.id,
          })
        );
      } else if (update) {
        // Update an existing feedback with annotaion image
        dispatch(
          updateFeedback(update.id, {
            content: feedback,
            mediaTime: currentTime,
            annotationUrl: image.url,
          })
        );
      } else {
        // Create a new feedback with annotation image
        dispatch(
          createFeedback({
            media: media.id,
            content: feedback,
            mediaTime: currentTime,
            annotationUrl: image.url,
          })
        );
      }
      dispatch({ type: ANNOTATION_IMAGE_RESET });
    }
  }, [dispatch, image, feedback, media, currentTime, reply, update]);

  // Run this after a new feedback created successful
  useEffect(() => {
    if (feedbackCreateSuccess && media) {
      dispatch(listFeedbacks(media.id));
      dispatch(isEmptyAnnotation(true));
      dispatch(setActiveAnnotation(false));
      dispatch({ type: FEEDBACK_REPLY_RESET });
      setFeedback('');
      dispatch(activeFeedback(feedbackCreateSuccess));
    }
  }, [feedbackCreateSuccess, media, dispatch]);

  // Run this after feedback updated successful
  useEffect(() => {
    if (feedbackUpdateSuccess && media) {
      dispatch(listFeedbacks(media.id));
      dispatch(isEmptyAnnotation(true));
      dispatch(setActiveAnnotation(false));
      dispatch({ type: FEEDBACK_TO_UPDATE_RESET });
      setFeedback('');
      dispatch(activeFeedback(feedbackUpdateSuccess));
    }
  }, [feedbackUpdateSuccess, media, dispatch]);

  useEffect(() => {
    if (update) {
      setFeedback(update.content);
    }
  }, [update]);

  // Run this if transcript created from backend
  useEffect(() => {
    if (transcript) {
      setFeedback(transcript);
      setTranscript('');
    }
  }, [transcript])

  const submitHandler = (e) => {
    e.preventDefault();
    if (feedback === '') {
      dispatch(messageToast('Feedback should not be empty.'));
      dispatch(variantToast('danger'));
      return dispatch(showToast(true));
    }
    if (!isEmpty) {
      // Check if the annotaion exists
      dispatch({ type: ANNOTATION_IMAGE_EXPORT });
    } else if (reply) {
      // If the action is reply to a feedback
      dispatch(
        createFeedback({
          media: media.id,
          content: feedback,
          mediaTime: currentTime,
          parent: reply.id,
        })
      );
    } else if (update) {
      // If the action is update an existing feedback
      dispatch(
        updateFeedback(update.id, {
          content: feedback,
          mediaTime: currentTime,
        })
      );
    } else {
      // If the action is creating a new feedback
      dispatch(
        createFeedback({
          media: media.id,
          content: feedback,
          mediaTime: currentTime,
        })
      );
    }
  };

  const updateCloseHandler = () => {
    dispatch({ type: FEEDBACK_TO_UPDATE_RESET });
    setFeedback('');
  };

  const drawableTypeHandler = (type) => {
    if (!active) {
      dispatch(setActiveAnnotation(true));
    }
    dispatch(drawableTypeAnnotation(type));
  };

  const clearAnnotationHandler = () => {
    dispatch(isEmptyAnnotation(true));
    dispatch(setActiveAnnotation(false));
  };

  return (
    <Row className='justify-content-md-center' ref={formFeedback}>
      <Col md={10}>
        <div
          className='my-2 p-3'
          style={{
            backgroundColor: '#303030',
            borderRadius: '.25rem',
            //marginLeft: '12rem',
            //marginRight: '12rem',
            width: '100%',
            display: 'inline-block',
          }}
        >
          <Form onSubmit={submitHandler}>
            <Form.Group controlId='email'>
              <Form.Control
                data-cy='feedback-textarea'
                as='textarea'
                rows={2}
                disabled={
                  user && review && !isCollaborator(user, review) ? true : false
                }
                placeholder={
                  user && review && !isCollaborator(user, review)
                    ? 'User is not a collaborator!'
                    : reply
                    ? `@${reply.user.username}: ${reply.content}`
                    : 'Write feedback...'
                }
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className='text-white'
                style={{
                  backgroundColor: '#3A3A3A',
                  border: '0px',
                }}
              ></Form.Control>
            </Form.Group>
            {(image && image.loading) ||
            feedbackCreateLoading ||
            feedbackUpdateLoading ? (
              <Button
                className='float-end'
                disabled
                style={{
                  marginTop: '0.65rem',
                }}
              >
                <Spinner
                  as='span'
                  animation='grow'
                  size='sm'
                  role='status'
                  aria-hidden='true'
                />
                &nbsp;Loading...
              </Button>
            ) : (
              user &&
              review &&
              media &&
              isCollaborator(user, review) && (
                <>
                  <Button
                    data-cy='feedback-submit'
                    type='submit'
                    variant={update ? 'success' : 'primary'}
                    className='float-end'
                    style={{
                      marginTop: '0.65rem',
                    }}
                  >
                    {reply ? 'REPLY' : update ? 'UPDATE' : 'POST'}
                  </Button>
                  <Button
                    className='float-end'
                    variant='danger'
                    style={{
                      marginTop: '0.65rem',
                      marginRight: '0.65rem',
                      height: '38px',
                      width: '34px',
                    }}
                    onClick={() => setShowTranscriptModal(true)}
                  >
                    <span
                      className='material-icons-round noselect'
                      style={{
                        //transform: 'rotate(-45deg)',
                        transform: 'translateX(-9px)',
                        fontSize: '26px',
                        //padding: '0 0.65rem',
                        position: 'relative',
                      }}
                    >
                      mic
                    </span>
                  </Button>
                  {reply ? (
                    <Button
                      type='submit'
                      variant='danger'
                      className='float-end'
                      style={{
                        marginTop: '0.65rem',
                        marginRight: '0.35rem',
                      }}
                      onClick={() => dispatch({ type: FEEDBACK_REPLY_RESET })}
                    >
                      CLOSE
                    </Button>
                  ) : (
                    update && (
                      <Button
                        type='submit'
                        variant='danger'
                        className='float-end'
                        style={{
                          marginTop: '0.65rem',
                          marginRight: '0.35rem',
                        }}
                        onClick={updateCloseHandler}
                      >
                        CLOSE
                      </Button>
                    )
                  )}
                </>
              )
            )}
          </Form>

          {/*Canvas Draw Options Start*/}
          <div
            style={{
              marginTop: '1.0rem',
              top: '-6px',
              border: '1px solid #222222',
              borderRadius: '0.25rem',
              display: 'inline-block',
            }}
          >
            {/*TODO: refactor onClick action and set active annotation*/}
            <span
              className='material-icons-round noselect'
              style={{
                cursor: 'pointer',
                padding: '0 0.65rem',
                color: `${
                  drawableType === 'CircleDrawable' && active
                    ? '#FFFFFF'
                    : '#222222'
                }`,
              }}
              onClick={() => drawableTypeHandler('CircleDrawable')}
            >
              radio_button_unchecked
            </span>

            <span
              className='material-icons-round noselect'
              style={{
                //transform: 'rotate(-45deg)',
                cursor: 'pointer',
                fontSize: '28px',
                padding: '0 0.65rem',
                color: `${
                  drawableType === 'ArrowDrawable' && active
                    ? '#FFFFFF'
                    : '#222222'
                }`,
              }}
              onClick={() => drawableTypeHandler('ArrowDrawable')}
            >
              trending_flat
            </span>

            <span
              className='material-icons-round noselect'
              style={{
                cursor: 'pointer',
                padding: '0 0.65rem',
                color: `${
                  drawableType === 'FreePathDrawable' && active
                    ? '#FFFFFF'
                    : '#222222'
                }`,
              }}
              onClick={() => drawableTypeHandler('FreePathDrawable')}
            >
              brush
            </span>
            <span
              className='material-icons-round noselect'
              style={{
                cursor: 'pointer',
                padding: '0 0.65rem',
                color: '#E74C3C',
              }}
              onClick={clearAnnotationHandler}
            >
              highlight_off
            </span>
            <span
              className='material-icons-round noselect'
              style={{
                cursor: 'pointer',
                padding: '0 0.65rem',
                color: color,
              }}
              onClick={() => setShowColorPalette(!showColorPalette)}
            >
              circle
            </span>
          </div>

          {/*Color Palette Start*/}
          <div
            style={{
              //backgroundColor: '#222222',
              borderRadius: '0.25rem',
              marginTop: '0.4rem',
              display: `${showColorPalette ? 'block' : 'none'}`,
            }}
            className='text-center'
          >
            <span
              className='material-icons-round noselect'
              style={{
                cursor: 'pointer',
                padding: '0.4rem 0.2rem',
                color: '#E74C3C',
              }}
              onClick={() => dispatch(setColorAnnotation('#E74C3C'))}
            >
              circle
            </span>
            <span
              className='material-icons-round noselect'
              style={{
                cursor: 'pointer',
                padding: '0.4rem 0.2rem',
                color: '#F38D1C',
              }}
              onClick={() => dispatch(setColorAnnotation('#F38D1C'))}
            >
              circle
            </span>
            <span
              className='material-icons-round noselect'
              style={{
                cursor: 'pointer',
                padding: '0.4rem 0.2rem',
                color: '#00BC71',
              }}
              onClick={() => dispatch(setColorAnnotation('#00BC71'))}
            >
              circle
            </span>
            <span
              className='material-icons-round noselect'
              style={{
                cursor: 'pointer',
                padding: '0.4rem 0.2rem',
                color: '#3498DB',
              }}
              onClick={() => dispatch(setColorAnnotation('#3498DB'))}
            >
              circle
            </span>
            <span
              className='material-icons-round noselect'
              style={{
                cursor: 'pointer',
                padding: '0.4rem 0.2rem',
                color: '#841397',
              }}
              onClick={() => dispatch(setColorAnnotation('#841397'))}
            >
              circle
            </span>
            <span
              className='material-icons-round noselect'
              style={{
                cursor: 'pointer',
                padding: '0.4rem 0.2rem',
                color: 'white',
              }}
              onClick={() => dispatch(setColorAnnotation('white'))}
            >
              circle
            </span>
            <span
              className='material-icons-round noselect'
              style={{
                cursor: 'pointer',
                padding: '0.4rem 0.2rem',
                color: 'black',
              }}
              onClick={() => dispatch(setColorAnnotation('black'))}
            >
              circle
            </span>
          </div>
          {/*Color Palette end*/}
          {/*Canvas Draw Options End*/}
          {/*Error Messages start*/}
          {image && image.error ? (
            <div style={{ marginTop: '1rem', marginBottom: '0px' }}>
              <Message>{image.error}</Message>
            </div>
          ) : feedbackCreateError ? (
            <div style={{ marginTop: '1rem', marginBottom: '0px' }}>
              <Message>Error {feedbackCreateError}</Message>
            </div>
          ) : (
            feedbackUpdateError && (
              <div style={{ marginTop: '1rem', marginBottom: '0px' }}>
                <Message>Error {feedbackUpdateError}</Message>
              </div>
            )
          )}
          {/*Error Messages end*/}

          {/*TranscriptModal*/}
          <TranscriptModal
            onHide={() => setShowTranscriptModal(false)}
            show={showTranscriptModal}
            onSuccess={setTranscript}
          />
        </div>
      </Col>
    </Row>
  );
};

export default FeedbackForm;
