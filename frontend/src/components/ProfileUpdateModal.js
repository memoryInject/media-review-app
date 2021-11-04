import React, { useState, useRef, useEffect } from 'react';
import { Modal, Form, Spinner, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';

import Message from './Message';
import { showToast, messageToast, variantToast } from '../actions/toastActions';
import {
  updateUser,
  getUserDetails,
  uploadImageUser,
} from '../actions/userActions';
import {
  USER_UPDATE_RESET,
  USER_UPLOAD_IMAGE_RESET,
} from '../constants/userConstants';

const ProfileUpdateModal = (props) => {
  const dispatch = useDispatch();

  const userUpdate = useSelector((state) => state.userUpdate);
  const { loading, error, user } = userUpdate;

  const userUploadImage = useSelector((state) => state.userUploadImage);
  const {
    loading: userUploadImageLoading,
    error: userUploadImageError,
    image,
  } = userUploadImage;

  const formRef = useRef(null);
  const formFile = useRef(null);

  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [validated, setValidated] = useState(false);

  // This run when the modal form opens
  useEffect(() => {
    if (props.show) {
      dispatch({ type: USER_UPDATE_RESET });
      setUsername(props.user.username);
      setFirstName(props.user.firstName);
      setLastName(props.user.lastName);
      setCompanyName(
        props.user.profile.companyName ? props.user.profile.companyName : ''
      );
      setValidated(false);
    }
  }, [dispatch, props]);

  // This run after successfully uploaded the image
  useEffect(() => {
    if (image) {
      dispatch({ type: USER_UPLOAD_IMAGE_RESET });
      let userEdit = {
        username,
        firstName,
        lastName,
        profile: {
          imageUrl: image.thumbnail,
          companyName,
        },
      };

      if (username === props.user.username) {
        delete userEdit.username;
      }

      dispatch(updateUser(userEdit));
    }
  }, [props, image, dispatch, username, firstName, lastName, companyName]);

  // This run after successfully updated the user
  useEffect(() => {
    if (user) {
      props.onHide();
      setValidated(false);
      dispatch(messageToast('User updated successfully'));
      dispatch(variantToast('success'));
      dispatch(showToast(true));
      dispatch(getUserDetails());
      dispatch({ type: USER_UPDATE_RESET });
    }
  }, [user, dispatch, props]);

  const submitHandler = () => {
    const form = formRef.current;

    if (form.checkValidity() === true) {
      if (formFile.current.files[0]) {
        dispatch(uploadImageUser(formFile.current.files[0]));
      } else {
        let userEdit = {
          username,
          firstName,
          lastName,
          profile: {
            companyName,
          },
        };

        if (username === props.user.username) {
          delete userEdit.username;
        }

        dispatch(updateUser(userEdit));
      }
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
            &nbsp; Edit profile
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
              <Form.Label>Username</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter user name'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading ? true : false}
                required
              />
              <Form.Control.Feedback type='invalid'>
                Please provide a valid user name.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className='mb-3'>
              <Form.Label>First name</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter first name'
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={loading ? true : false}
              />
            </Form.Group>

            <Form.Group className='mb-3'>
              <Form.Label>Last name</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter last name'
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={loading ? true : false}
              />
            </Form.Group>

            <Form.Group className='mb-3'>
              <Form.Label>Company name</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter company name'
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                disabled={loading ? true : false}
              />
            </Form.Group>

            <Form.Group controlId='formFile' className='mb-3'>
              <Form.Label>
                Profile image<span className='text-muted'> (optional)</span>
              </Form.Label>
              <Form.Control
                type='file'
                ref={formFile}
                disabled={loading ? true : false}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        {loading || userUploadImageLoading ? (
          <div className='d-flex justify-content-center'>
            <Spinner
              animation='border'
              style={{
                transition: 'all 0.5s ease-in-out',
              }}
            />
          </div>
        ) : user ? (
          <div style={{ minHeight: '30px' }}></div>
        ) : (
          <>
            {error && <Message>{error}</Message>}
            {userUploadImageError && <Message>{userUploadImageError}</Message>}
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
    </>
  );
};

export default ProfileUpdateModal;
