import React, { useState, useEffect } from 'react';
import { Form, Button, Spinner, ToastContainer, Toast } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { invitationCollaborator, hideUICollaborator } from '../../actions/collaboratorActions';

import Message from '../Message';

const InvitationForm = () => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [showToast, setShowToast] = useState(false);

  const reviewDetails = useSelector((state) => state.reviewDetails);
  const { review } = reviewDetails;

  const collaboratorInvitation = useSelector(
    (state) => state.collaboratorInvitation
  );
  const { loading, success, error } = collaboratorInvitation;

  useEffect(() => {
    if (success) {
      setShowToast(true);
      setEmail('')
      dispatch(hideUICollaborator())
    }
  }, [success, dispatch]);

  const invitationHandler = (e) => {
    e.preventDefault();
    dispatch(invitationCollaborator(email));
  };

  return (
    <>
      {error && <Message>{error}</Message>}
      <Form onSubmit={invitationHandler} className='py-3'>
        <Form.Group className='mb-3' controlId='formBasicEmail'>
          <Form.Label>
            {' '}
            Send an email invitation to add a collaborator
          </Form.Label>
          <Form.Control
            type='email'
            placeholder='Enter email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Form.Text className='text-muted'>
            The invitation contains all the information about how to sign up on
            this review: {review.reviewName}
          </Form.Text>
        </Form.Group>

        {loading ? (
          <div className='d-flex justify-content-center'>
            <Spinner
              animation='border'
              style={{
                transition: 'all 0.5s ease-in-out',
              }}
            />
          </div>
        ) : (
          <Button variant='primary' type='submit'>
            Send invitation
          </Button>
        )}
      </Form>

      {/*Success toast after the invitation send*/}
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
          <Toast.Body>Successfully send email.</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
};

export default InvitationForm;
