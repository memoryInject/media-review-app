import React, { useState, useRef, useEffect } from 'react';
import { Modal, Form, Spinner, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';

import Message from './Message';
import { showToast, messageToast, variantToast } from '../actions/toastActions';
import { passwordResetEmailUser } from '../actions/userActions';
import { USER_PASSWORD_RESET_EMAIL_RESET } from '../constants/userConstants';

const PasswordResetEmailModal = (props) => {
  const dispatch = useDispatch();

  const userPasswordResetEmail = useSelector(
    (state) => state.userPasswordResetEmail
  );
  const { loading, error, success } = userPasswordResetEmail;

  const formRef = useRef(null);

  const [email, setEmail] = useState('');
  const [validated, setValidated] = useState(false);

  // This run when the modal form opens
  useEffect(() => {
    if (props.show) {
      dispatch({ type: USER_PASSWORD_RESET_EMAIL_RESET });
      setEmail(props.user.email);
      setValidated(false);
    }
  }, [dispatch, props]);

  // This run after successfully send password reset email to user
  useEffect(() => {
    if (success) {
      props.onHide();
      setValidated(false);
      dispatch(messageToast('Password reset email send successfully'));
      dispatch(variantToast('success'));
      dispatch(showToast(true));
      dispatch({ type: USER_PASSWORD_RESET_EMAIL_RESET });
    }
  }, [success, dispatch, props]);

  const submitHandler = () => {
    const form = formRef.current;

    if (form.checkValidity() === true) {
      dispatch(passwordResetEmailUser(email));
    }
    setValidated(true);
  };

  return (
    <>
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
            &nbsp; Password reset email
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
              <Form.Label>Email</Form.Label>
              <Form.Control
                data-cy='email'
                type='email'
                placeholder='Enter email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading ? true : false}
                required
              />
              <Form.Control.Feedback type='invalid'>
                Please provide a valid email.
              </Form.Control.Feedback>
              <Form.Text className='text-muted'>
                We'll send password rest link to your email.
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        {loading ? (
          <div className='d-flex justify-content-center'>
            <Spinner
              animation='border'
              style={{
                transition: 'all 0.5s ease-in-out',
              }}
            />
          </div>
        ) : success ? (
          <div style={{ minHeight: '30px' }}></div>
        ) : (
          <>
            {error && <Message>{error}</Message>}
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
    </>
  );
};

export default PasswordResetEmailModal;
