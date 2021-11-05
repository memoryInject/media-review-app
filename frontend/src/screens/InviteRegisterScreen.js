import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';

import Message from '../components/Message';
import Loader from '../components/Loader';

import { showToast, messageToast, variantToast } from '../actions/toastActions';
import { inviteGetEmailUser, inviteAcceptUser } from '../actions/userActions';
import {
  USER_INVITE_GET_EMAIL_RESET,
  USER_INVITE_ACCEPT_RESET,
} from '../constants/userConstants';

const InviteRegisterScreen = ({ history, match }) => {
  const dispatch = useDispatch();

  const userInviteGetEmail = useSelector((state) => state.userInviteGetEmail);
  const {
    loading: getEmailLoading,
    email: getEmail,
    error: getEmailError,
  } = userInviteGetEmail;

  const userInviteAccept = useSelector((state) => state.userInviteAccept);
  const {
    loading: acceptLoading,
    success,
    error: acceptError,
  } = userInviteAccept;

  const formRef = useRef(null);

  const [validated, setValidated] = useState(false);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Run this when this component loads and unloads 
  useEffect(() => {
    dispatch(inviteGetEmailUser(match.params.key));
    return () => dispatch({ type: USER_INVITE_GET_EMAIL_RESET });
  }, [match.params.key, dispatch]);

  useEffect(() => {
    if (getEmail) {
      setEmail(getEmail.email);
    }
  }, [getEmail]);

  // This will run after successfully accept user
  useEffect(() => {
    if (success) {
      dispatch(messageToast('Accept user successfully'));
      dispatch(variantToast('success'));
      dispatch(showToast(true));
      dispatch({ type: USER_INVITE_ACCEPT_RESET });
      history.push('/');
    }
  }, [success, history, dispatch]);

  const submitHandler = (e) => {
    e.preventDefault();
    const form = formRef.current;

    if (form.checkValidity() === true) {
      if (password === confirmPassword) {
        setMessage('');
        const data = { email, password, key: match.params.key };
        dispatch(inviteAcceptUser(data));
      } else {
        setMessage('Password and confirm password does not match!');
      }
    }

    setValidated(true);
  };

  return (
    <Container>
      <Row className='dflex justify-content-center'>
        <Col
          xs={12}
          md={12}
          lg={5}
          className='bg-dark py-2'
          style={{ borderRadius: '0.25rem' }}
        >
          <div className='text-light py-2 text-center'>
            <span
              className='material-icons-round'
              style={{ transform: 'translate(0, 4px)', fontSize: '32px' }}
            >
              account_circle
            </span>
            &nbsp;<h5 className='fw-bold'>Accept Invite</h5>
          </div>
          {getEmailLoading || (acceptLoading && <Loader />)}
          {getEmailError && <Message>{getEmailError}</Message>}
          {acceptError && <Message>{acceptError}</Message>}
          {message && <Message fix>{message}</Message>}
          <Form
            noValidate
            validated={validated}
            ref={formRef}
            onSubmit={submitHandler}
          >
            <Form.Group className='mb-3' controlId='formBasicEmail'>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type='email'
                placeholder='User email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled
                required
              />
              <Form.Text className='text-muted'>
                The email for the invited user
              </Form.Text>
              <Form.Control.Feedback type='invalid'>
                Please provide a valid email.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className='mb-3' controlId='formBasicPassword'>
              <Form.Label>New password</Form.Label>
              <Form.Control
                type='password'
                placeholder='Enter new password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={getEmailLoading || acceptLoading ? true : false}
                required
                pattern='(?=.*\d)(?=.*[a-z]).{5,}'
              />
              <Form.Text className='text-muted'>
                Password must contains a number and at least 5 character long.
              </Form.Text>
              <Form.Control.Feedback type='invalid'>
                Please provide a valid password.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className='mb-3'>
              <Form.Label>Confirm new password</Form.Label>
              <Form.Control
                type='password'
                placeholder='Enter new password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={getEmailLoading || acceptLoading ? true : false}
                required
                pattern='(?=.*\d)(?=.*[a-z]).{5,}'
              />
              <Form.Control.Feedback type='invalid'>
                Please provide a valid password.
              </Form.Control.Feedback>
            </Form.Group>
            <div className='text-end'>
              <Button
                type='submit'
                disabled={getEmailLoading || acceptLoading ? true : false}
              >
                Submit
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default InviteRegisterScreen;
