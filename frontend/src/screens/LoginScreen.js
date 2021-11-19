import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import FormContainer from '../components/FormContainer';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { login } from '../actions/userActions';
import PasswordResetEmailModal from '../components/PasswordResetEmailModal';

const LoginScreen = ({ location, history }) => {

  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPasswordResetModal, setShowPasswordResetModal] = useState(false);



  const redirect = location.search ? location.search.split('=')[1] : '/';

  useEffect(() => {
    if (userInfo) {
      history.push(redirect);
    }
  }, [history, redirect, userInfo]);

  const submitHandler = (e) => {
    e.preventDefault();

    dispatch(login(email, password));
  };

  return (
    <FormContainer>
      <div className='bg-dark p-3' style={{ borderRadius: '0.25rem' }}>
        <div className='text-light py-2 text-center'>
          <span
            className='material-icons-round'
            style={{ transform: 'translate(0, 4px)' }}
          >
            login
          </span>
          &nbsp;<h5 className='fw-bold'>Sign In</h5>
        </div>
        {error && <Message>{error}</Message>}
        {loading && <Loader />}
        <Form onSubmit={submitHandler}>
          <Form.Group controlId='email'>
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type='email'
              placeholder='Enter Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId='password' className='py-3'>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Enter Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <div className='text-end'>
            <Button type='submit' variant='primary' data-testid='sign-in-btn'>
              Sign In
            </Button>
          </div>
        </Form>
        <button
          className='btn-clear text-success'
          onClick={()=>setShowPasswordResetModal(true)}
        >
          Forgot password?
        </button>
      </div>

      {/*Modal Form to send reset email link*/}
      <PasswordResetEmailModal
        onHide={() => setShowPasswordResetModal(false)}
        show={showPasswordResetModal}
        user={{email: ''}}
      />
    </FormContainer>
  );
};

export default LoginScreen;
