import React, { useState, useRef, useEffect } from 'react';
import { Button, Form, Spinner } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';

import Message from '../components/Message';
import ModalDialog from '../components/ModalDialog';
import { showToast, messageToast, variantToast } from '../actions/toastActions';
import {deleteReview, listReviewDetails, updateReview} from '../actions/reviewActions';
import {REVIEW_DELETE_RESET, REVIEW_UPDATE_RESET} from '../constants/reviewConstants';

const ReviewUpdateDeleteForm = ({history, match, review, userDetails}) => {
  const dispatch = useDispatch();

  const reviewUpdate = useSelector((state) => state.reviewUpdate);
  const {
    loading: reviewUpdateLoading,
    error: reviewUpdateError,
    review: reviewUpdateReview,
  } = reviewUpdate;

  const reviewDelete = useSelector((state) => state.reviewDelete);
  const {
    loading: reviewDeleteLoading,
    error: reviewDeleteError,
    success,
  } = reviewDelete;

  const formRef = useRef(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [validated, setValidated] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (review) {
      setName(review.reviewName);
      setDescription(review.description);
    }
  }, [review]);

  // This run after successfully Updated the review
  useEffect(() => {
    if (reviewUpdateReview) {
      dispatch(messageToast('Review updated successfully'));
      dispatch(variantToast('success'));
      dispatch(showToast(true));
      dispatch(listReviewDetails(match.params.id));
      dispatch({ type: REVIEW_UPDATE_RESET });
    }
  }, [reviewUpdateReview, dispatch, match.params.id]);

  // This run after successfully delete the project
  useEffect(() => {
    if (success) {
      dispatch(messageToast('Project deleted successfully'));
      dispatch(variantToast('success'));
      dispatch(showToast(true));
      dispatch({ type: REVIEW_DELETE_RESET });
      history.push('/');
    }
  }, [success, dispatch, history]);


  const submitHandler = () => {
    const form = formRef.current;

    if (form.checkValidity() === true) {
      dispatch(updateReview(match.params.id, { reviewName: name, description }));
    }

    setValidated(true);
  };

  const confirmDeleteHandler = () => {
    dispatch(deleteReview(match.params.id));
  };


  return (
    <>
      <h4 className='text-light'>
        <span
          className='material-icons-round noselect'
          style={{ position: 'relative', top: '3px' }}
        >
          settings
        </span>
        &nbsp;
        {review && review.reviewName}
      </h4>
      <h6 className='text-muted'>Creator: {review.user.username}</h6>
      {reviewUpdateError && <Message>{reviewUpdateError}</Message>}
      {reviewDeleteError && <Message>{reviewDeleteError}</Message>}
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
              reviewUpdateLoading ||
              review.user.id !== userDetails.user.id
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
              reviewUpdateLoading ||
              review.user.id !== userDetails.user.id
                ? true
                : false
            }
              required
            />
            <Form.Control.Feedback type='invalid'>
              Please provide a valid description.
            </Form.Control.Feedback>
          </Form.Group>
        {reviewUpdateLoading ||
        reviewDeleteLoading ? (
          <div className='d-flex justify-content-center'>
            <Spinner
              animation='border'
              style={{
                transition: 'all 0.5s ease-in-out',
              }}
            />
          </div>
        ) : (
          review.user.id === userDetails.user.id && (
            <div className='text-end'>
              <Button onClick={() => setShowModal(true)} variant='danger'>
                Delete
              </Button>
              &nbsp; &nbsp;
              <Button onClick={submitHandler}>Update</Button>
            </div>
          )
        )}
      </Form>

      {/*Confirm dialog for review delete*/}
      <ModalDialog
        title='Delete review'
        content={'This will delete the review forever!'}
        state={showModal}
        stateCallback={setShowModal}
        callback={confirmDeleteHandler}
      />
    </>
  );
};

export default ReviewUpdateDeleteForm;
