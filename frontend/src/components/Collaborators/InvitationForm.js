import React, { useState, useEffect } from 'react';
import { Form, Button, Spinner } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import {
  invitationCollaborator,
  hideUICollaborator,
} from '../../actions/collaboratorActions';

import Message from '../Message';
import {
  showToast,
  messageToast,
  variantToast,
} from '../../actions/toastActions';
import { COLLABORATOR_INVITATION_RESET } from '../../constants/collaboratorConstants';

const InvitationForm = () => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');

  const reviewDetails = useSelector((state) => state.reviewDetails);
  const { review } = reviewDetails;

  const collaboratorInvitation = useSelector(
    (state) => state.collaboratorInvitation
  );
  const { loading, success, error } = collaboratorInvitation;

  useEffect(() => {
    if (success) {
      dispatch(messageToast('Successfully send email.'));
      dispatch(variantToast('success'));
      dispatch(showToast());
      setEmail('');
      dispatch({ type: COLLABORATOR_INVITATION_RESET });
      dispatch(hideUICollaborator());
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
            data-cy='invitaion-email'
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
          <Button
            data-cy='submit-invitation'
            variant='primary'
            type='submit'
            data-testid='send-invitation-btn'
          >
            Send invitation
          </Button>
        )}
      </Form>
    </>
  );
};

export default InvitationForm;
