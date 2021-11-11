import React, { useState, useEffect, useRef } from 'react';
import { Modal, Form, Button, Spinner } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';

import Message from './Message';
import { showToast, messageToast, variantToast } from '../actions/toastActions';
import { createReview, listReview } from '../actions/reviewActions';
import { REVIEW_CREATE_RESET } from '../constants/reviewConstants';

const ProjectCreateReviewModal = (props) => {
  const dispatch = useDispatch();

  const projectDetails = useSelector((state) => state.projectDetails);
  const { project } = projectDetails;

  const reviewCreate = useSelector((state) => state.reviewCreate);
  const {
    loading: reviewCreateLoading,
    error: reviewCreateError,
    review,
  } = reviewCreate;

  const formRef = useRef(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [validated, setValidated] = useState(false);

  // This run when the modal form opens
  useEffect(() => {
    if (props.show) {
      dispatch({ type: REVIEW_CREATE_RESET });
      setName('');
      setDescription('');
      setValidated(false);
    }
  }, [props.show, dispatch]);

  // This run after successfully created the review
  useEffect(() => {
    if (review) {
      props.onHide();
      setValidated(false);
      setName('');
      setDescription('');
      dispatch(messageToast('Review created successfully'));
      dispatch(variantToast('success'));
      dispatch(showToast(true));
      dispatch(listReview(props.id));
      dispatch({ type: REVIEW_CREATE_RESET });
    }
  }, [review, dispatch, props]);

  const submitHandler = () => {
    const form = formRef.current;
    if (form.checkValidity() === true) {
      dispatch(
        createReview({
          project: project.id,
          reviewName: name,
          description,
        })
      );
    }
    setValidated(true);
  };

  return (
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
          &nbsp; Create review
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
              type='text'
              placeholder='Enter review name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={reviewCreateLoading ? true : false}
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
              disabled={reviewCreateLoading ? true : false}
              required
            />
            <Form.Control.Feedback type='invalid'>
              Please provide a valid description.
            </Form.Control.Feedback>
          </Form.Group>
        </Form>
      </Modal.Body>
      {reviewCreateLoading ? (
        <div className='d-flex justify-content-center'>
          <Spinner
            animation='border'
            style={{
              transition: 'all 0.5s ease-in-out',
            }}
          />
        </div>
      ) : review ? (
        <div style={{ minHeight: '30px' }}></div>
      ) : (
        <>
          {reviewCreateError && <Message>{reviewCreateError}</Message>}
          <Modal.Footer>
            <Button onClick={props.onHide} variant='danger'>
              Close
            </Button>
            <Button variant='primary' onClick={submitHandler}>
              Submit
            </Button>
          </Modal.Footer>
        </>
      )}
    </Modal>
  );
};

export default ProjectCreateReviewModal;
