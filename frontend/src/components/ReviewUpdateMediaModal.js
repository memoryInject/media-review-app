import React, { useState, useRef, useEffect } from 'react';
import { Modal, Form, Spinner, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';

import Message from './Message';
import Loader from './Loader';
import { showToast, messageToast, variantToast } from '../actions/toastActions';

import { listMediaDetails, updateMedia } from '../actions/mediaActions';
import { listReviewDetails } from '../actions/reviewActions';
import { MEDIA_UPDATE_RESET } from '../constants/mediaConstants';

const ReviewUpdateMediaModal = (props) => {
  const dispatch = useDispatch();

  const mediaDetails = useSelector((state) => state.mediaDetails);
  const { loading, error, media } = mediaDetails;

  const mediaUpdate = useSelector((state) => state.mediaUpdate);
  const {
    loading: mediaUpdateLoading,
    error: mediaUpdateError,
    media: mediaUpdateMedia,
  } = mediaUpdate;

  const formRef = useRef(null);

  const [name, setName] = useState('');
  const [version, setVersion] = useState(0);
  const [validated, setValidated] = useState(false);

  // This run when the modal form opens
  useEffect(() => {
    if (props.show) {
      dispatch(listMediaDetails(props.id));
      dispatch({ type: MEDIA_UPDATE_RESET });
      setName('');
      setVersion(0);
      setValidated(false);
    }
  }, [props.show, dispatch, props]);

  // This run after the media loaded
  useEffect(() => {
    if (media) {
      setName(media.mediaName);
      setVersion(media.version);
    }
  }, [media]);

  // This run after successfully updated the media
  useEffect(() => {
    if (mediaUpdateMedia) {
      props.onHide();
      setValidated(false);
      setName(mediaUpdateMedia.mediaName);
      setVersion(mediaUpdateMedia.version);
      dispatch(messageToast('Media updated successfully'));
      dispatch(variantToast('success'));
      dispatch(showToast(true));
      dispatch(listMediaDetails(props.id));
      dispatch(listReviewDetails(props.match.params.reviewId));
      dispatch({ type: MEDIA_UPDATE_RESET });
    }
  }, [mediaUpdateMedia, dispatch, props]);

  const submitHandler = () => {
    const form = formRef.current;
    if (form.checkValidity() === true) {
      dispatch(
        updateMedia(props.id, {
          mediaName: name,
          version,
        })
      );
    }
    setValidated(true);
  };

  return (
    <>
      {error && <Message>{error}</Message>}
      {loading ? (
        <Loader />
      ) : (
        <Modal
          show={props.show}
          onHide={props.onHide}
          aria-labelledby='contained-modal-title-vcenter'
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id='contained-modal-title-vcenter'>
              <span
                className='material-icons-round'
                style={{ transform: 'translate(0, 4px)' }}
              >
                movie
              </span>
              &nbsp; Edit media
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form
              noValidate
              validated={validated}
              ref={formRef}
              onSubmit={(e) => e.preventDefault()}
            >
              <Form.Group className='mb-3' controlId='validationCustom01'>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  data-cy='media-name'
                  type='text'
                  placeholder='Enter media name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={mediaUpdateLoading ? true : false}
                  required
                />
                <Form.Control.Feedback type='invalid'>
                  Please provide a valid name.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className='mb-3'>
                <Form.Label>Version</Form.Label>
                <Form.Control
                  data-cy='media-version'
                  type='number'
                  placeholder='Enter media version'
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  disabled={mediaUpdateLoading ? true : false}
                  required
                />
                <Form.Control.Feedback type='invalid'>
                  Please provide a valid version.
                </Form.Control.Feedback>
              </Form.Group>
            </Form>
          </Modal.Body>
          {mediaUpdateLoading ? (
            <div className='d-flex justify-content-center'>
              <Spinner
                animation='border'
                style={{
                  transition: 'all 0.5s ease-in-out',
                }}
              />
            </div>
          ) : mediaUpdateMedia ? (
            <div style={{ minHeight: '30px' }}></div>
          ) : (
            <>
              {mediaUpdateError && <Message>{mediaUpdateError}</Message>}
              <Modal.Footer>
                <Button onClick={props.onHide} variant='danger'>
                  Close
                </Button>
                <Button
                  data-cy='submit'
                  variant='primary'
                  onClick={submitHandler}
                >
                  Submit
                </Button>
              </Modal.Footer>
            </>
          )}
        </Modal>
      )}
    </>
  );
};

export default ReviewUpdateMediaModal;
