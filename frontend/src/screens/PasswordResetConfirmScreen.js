import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';

import Message from '../components/Message';
import Loader from '../components/Loader';

import { showToast, messageToast, variantToast } from '../actions/toastActions';
import { passwordResetConfirmUser } from '../actions/userActions';
import { USER_PASSWORD_RESET_CONFIRM_RESET } from '../constants/userConstants';

const PasswordResetConfirmScreen = ({ history, match }) => {
  const dispatch = useDispatch();

  const userPasswordResetConfirm = useSelector(
    (state) => state.userPasswordResetConfirm
  );
  const { loading, success, error } = userPasswordResetConfirm;

  const formRef = useRef(null);

  const [validated, setValidated] = useState(false);
  const [message, setMessage] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (success) {
      dispatch(messageToast('Password reset successfully'));
      dispatch(variantToast('success'));
      dispatch(showToast(true));
      dispatch({ type: USER_PASSWORD_RESET_CONFIRM_RESET });
      history.push('/');
    }
  }, [success, history, dispatch]);

  const submitHandler = (e) => {
    e.preventDefault();
    const form = formRef.current;

    if (form.checkValidity() === true) {
      if (password === confirmPassword) {
        setMessage('');
        dispatch(
          passwordResetConfirmUser({
            uid: match.params.uid,
            token: match.params.token,
            newPassword1: password,
            newPassword2: password,
          })
        );
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
              style={{ transform: 'translate(0, 4px)' }}
            >
              lock
            </span>
            &nbsp;<h5 className='fw-bold'>Password Reset</h5>
          </div>
          {loading && <Loader />}
          {error && <Message>{error}</Message>}
          {message && <Message fix>{message}</Message>}
          <Form
            noValidate
            validated={validated}
            ref={formRef}
            onSubmit={submitHandler}
          >
            <Form.Group className='mb-3' controlId='formBasicEmail'>
              <Form.Label>New password</Form.Label>
              <Form.Control
                type='password'
                placeholder='Enter new password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading ? true : false}
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
                disabled={loading ? true : false}
                required
                pattern='(?=.*\d)(?=.*[a-z]).{5,}'
              />
              <Form.Control.Feedback type='invalid'>
                Please provide a valid password.
              </Form.Control.Feedback>
            </Form.Group>
            <div className='text-end'>
              <Button type='submit' disabled={loading ? true : false}>
                Submit
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default PasswordResetConfirmScreen;
