import axios from 'axios';
import React, { useState, useEffect } from 'react';
import {
  Button,
  Offcanvas,
  Image,
  OverlayTrigger,
  Tooltip,
  Form,
  ListGroup,
  ToastContainer,
  Toast,
} from 'react-bootstrap';

import { useSelector } from 'react-redux';
import getError from '../utils/getError';
import Loader from './Loader';
import Message from './Message';

const Collaborators = () => {
  const [showCollaborators, setShowCollaborators] = useState(false);
  const [collabInfo, setCollabInfo] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState('');
  const [sendInvitaion, setSendInvitation] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const reviewDetails = useSelector((state) => state.reviewDetails);
  const { review } = reviewDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    setCollabInfo(null);
    setShowForm(false);
    setEmail('');
    setSendInvitation(false);
    setErrorMessage('');
  }, [showCollaborators]);

  const collabInfoHandler = (collab) => {
    setCollabInfo(collab);
    setShowForm(false);
  };

  const addCollabHandler = () => {
    setShowForm(true);
    setCollabInfo(null);
  };

  const invitationHandler = async (e) => {
    e.preventDefault();

    setSendInvitation(true);

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${userInfo.key}`,
      },
    };

    try {
      if (email) {
        await axios.post('/api/v1/auth/invite/', { email }, config);
      }

      setToastMessage(`Email successfully send to ${email}`);
      setSendInvitation(false);
      setShowToast(true);
      setShowCollaborators(false);
    } catch (error) {
      setSendInvitation(false);
      setErrorMessage(getError(error));
    }
  };

  return (
    <>
      <Button
        variant='outline-info'
        style={{ minHeight: '6rem', width: '49%' }}
        onClick={() => setShowCollaborators(true)}
      >
        <span className='material-icons-round'>people</span>
        <h6>Members</h6>
      </Button>{' '}
      <Offcanvas
        show={showCollaborators}
        onHide={() => setShowCollaborators(false)}
        placement='end'
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            Collaborators
            {review && (
              <>
                <h6
                  style={{ fontSize: '14px', margin: '3px 0px' }}
                  className='text-muted'
                >
                  <span className='text-muted'>Review&nbsp; : </span>
                  {review.reviewName}
                </h6>
                <h6 style={{ fontSize: '14px' }} className='text-muted'>
                  <span className='text-muted'>Creator : </span>
                  {review.user.username}
                </h6>
              </>
            )}
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div>
            {review &&
              review.collaborators.map((c, idx) => (
                <div key={idx} style={{ display: 'inline' }}>
                  <OverlayTrigger
                    placement='bottom'
                    overlay={
                      <Tooltip id='button-tooltip'>{c.username}</Tooltip>
                    }
                  >
                    <Image
                      src={c.profile.imageUrl}
                      roundedCircle
                      style={{ height: '42px', cursor: 'pointer' }}
                      onClick={() => collabInfoHandler(c)}
                    />
                  </OverlayTrigger>
                  &nbsp;
                </div>
              ))}
          </div>

          {/*Add collaborator button*/}
          <div className='py-3'>
            <OverlayTrigger
              placement='bottom'
              overlay={<Tooltip id='button-tooltip'>Add collaborator</Tooltip>}
            >
              <Button
                variant='outline-info'
                style={{ borderRadius: '42px', width: '42px', height: '42px' }}
                onClick={() => addCollabHandler()}
              >
                <span
                  className='material-icons-round'
                  style={{ transform: 'translate(-5px, 2px)' }}
                >
                  person_add
                </span>
              </Button>
            </OverlayTrigger>
          </div>

          {/*Show collaborator info when click the profile*/}
          {collabInfo && (
            <>
              <ListGroup as='ol'>
                <ListGroup.Item
                  as='li'
                  className='d-flex justify-content-between align-items-start'
                >
                  <div className='ms-2 me-auto'>
                    <div className='fw-bold text-secondary'>Username</div>
                    {collabInfo.username}
                  </div>
                </ListGroup.Item>
                <ListGroup.Item
                  as='li'
                  className='d-flex justify-content-between align-items-start'
                >
                  <div className='ms-2 me-auto'>
                    <div className='fw-bold text-secondary'>Email</div>
                    {collabInfo.email}
                  </div>
                </ListGroup.Item>
                <ListGroup.Item
                  as='li'
                  className='d-flex justify-content-between align-items-start'
                >
                  <div className='ms-2 me-auto'>
                    <div className='fw-bold text-secondary'>First name</div>
                    {collabInfo.firstName}
                  </div>
                </ListGroup.Item>
                <ListGroup.Item
                  as='li'
                  className='d-flex justify-content-between align-items-start'
                >
                  <div className='ms-2 me-auto'>
                    <div className='fw-bold text-secondary'>Last name</div>
                    {collabInfo.lastName}
                  </div>
                </ListGroup.Item>
                <ListGroup.Item
                  as='li'
                  className='d-flex justify-content-between align-items-start'
                >
                  <div className='ms-2 me-auto'>
                    <div className='fw-bold text-secondary'>Company name</div>
                    {collabInfo.profile.companyName}
                  </div>
                </ListGroup.Item>
                {collabInfo.profile.isAdmin && (
                  <ListGroup.Item
                    as='li'
                    className='d-flex justify-content-between align-items-start'
                    variant='warning'
                  >
                    <div className='ms-2 me-auto'>
                      <div className='fw-bold'>Admin access</div>
                      True
                    </div>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </>
          )}

          {/*Email invitation form to add new collaborator*/}
          {sendInvitaion ? (
            <Loader />
          ) : (
            showForm && (
              <>
                {errorMessage && <Message>{errorMessage}</Message>}
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
                      The invitation contains all the information about how to
                      sign up on this review: {review.reviewName}
                    </Form.Text>
                  </Form.Group>

                  <Button variant='primary' type='submit'>
                    Send invitation
                  </Button>
                </Form>
              </>
            )
          )}
        </Offcanvas.Body>
      </Offcanvas>
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
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
};

export default Collaborators;
