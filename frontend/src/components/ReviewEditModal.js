import React, { useState, useRef, useEffect } from 'react';
import { Button, Form, Spinner, Modal } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';

import Message from '../components/Message';
import { showToast, messageToast, variantToast } from '../actions/toastActions';
import { listReviewDetails, updateReview } from '../actions/reviewActions';
import { REVIEW_UPDATE_RESET } from '../constants/reviewConstants';

const ReviewEditModal = ({ match, show, onHide, userDetails, review }) => {
  const dispatch = useDispatch();

  const reviewUpdate = useSelector((state) => state.reviewUpdate);
  const {
    loading: reviewUpdateLoading,
    error: reviewUpdateError,
    review: reviewUpdateReview,
  } = reviewUpdate;

  const formRef = useRef(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [open, setOpen] = useState(true);
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    if (review) {
      setName(review.reviewName);
      setDescription(review.description);
      setOpen(review.isOpen);
    }
  }, [review]);

  // This run after successfully Updated the review
  useEffect(() => {
    if (reviewUpdateReview) {
      dispatch(messageToast('Review updated successfully'));
      dispatch(variantToast('success'));
      dispatch(showToast(true));
      dispatch(listReviewDetails(match.params.reviewId));
      dispatch({ type: REVIEW_UPDATE_RESET });
      onHide();
    }
  }, [reviewUpdateReview, dispatch, match, onHide]);

  const submitHandler = () => {
    const form = formRef.current;

    if (form.checkValidity() === true) {
      dispatch(
        updateReview(match.params.reviewId, {
          reviewName: name,
          description,
          isOpen: open,
        })
      );
    }

    setValidated(true);
  };

  return (
    <>
      <Modal
        show={show}
        onHide={onHide}
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
            &nbsp; Edit review
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            noValidate
            validated={validated}
            ref={formRef}
            onSubmit={(e) => e.preventDefault()}
          >
            <Form.Group className='mb-3' controlId='formBasicEmail'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter review name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={
                  reviewUpdateLoading || review.user.id !== userDetails.user.id
                    ? true
                    : false
                }
                required
              />
              <Form.Control.Feedback type='invalid'>
                Please provide a valid name.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className='mb-3'>
              <Form.Label>Description</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter review description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={
                  reviewUpdateLoading || review.user.id !== userDetails.user.id
                    ? true
                    : false
                }
                required
              />
              <Form.Control.Feedback type='invalid'>
                Please provide a valid description.
              </Form.Control.Feedback>
            </Form.Group>
          </Form>

          {/*Put this checkbox outside the form to avoid color change during validation*/}
          <Form.Group>
            <Form.Check
              checked={open}
              onChange={(e) => setOpen(e.target.checked)}
              type='switch'
              id='custom-switch'
              label={open ? 'Open' : 'Closed'}
              className={open ? 'text-success fw-bold' : 'text-danger fw-bold'}
            />
          </Form.Group>
        </Modal.Body>
        {reviewUpdateLoading ? (
          <div className='d-flex justify-content-center'>
            <Spinner
              animation='border'
              style={{
                transition: 'all 0.5s ease-in-out',
              }}
            />
          </div>
        ) : reviewUpdateReview ? (
          <div style={{ minHeight: '30px' }}></div>
        ) : (
          <>
            {reviewUpdateError && <Message>{reviewUpdateError}</Message>}
            <Modal.Footer>
              <Button onClick={onHide} variant='danger'>
                Close
              </Button>
              <Button variant='primary' onClick={submitHandler}>
                Submit
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </>
  );
};

export default ReviewEditModal;
