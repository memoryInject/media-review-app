import React, { useState, useEffect } from 'react';
import {
  Button,
  Offcanvas,
  Image,
  OverlayTrigger,
  Tooltip,
  Form,
  ListGroup,
} from 'react-bootstrap';

import { useSelector, useDispatch } from 'react-redux';

const Collaborators = () => {
  const [showCollaborators, setShowCollaborators] = useState(false);
  const [collabInfo, setCollabInfo] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const reviewDetails = useSelector((state) => state.reviewDetails);
  const { review } = reviewDetails;

  useEffect(() => {
    setCollabInfo(null);
    setShowForm(false);
  }, [showCollaborators]);

  const collabInfoHandler = (collab) => {
    setCollabInfo(collab);
    setShowForm(false);
  };

  const addCollabHandler = () => {
    setShowForm(true);
    setCollabInfo(null);
  };

  const invitationHandler = (e) => {
    e.preventDefault();
    console.log('hello');
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
          <div className='py-3'>
            <OverlayTrigger
              placement='bottom'
              overlay={<Tooltip id='button-tooltip'>Add collaborator</Tooltip>}
            >
              <Button
                variant='outline-info'
                style={{ borderRadius: '50px', width: '50px', height: '50px' }}
                onClick={() => addCollabHandler()}
              >
                <span
                  className='material-icons-round'
                  style={{ transform: 'translate(0, 2px)' }}
                >
                  person_add
                </span>
              </Button>
            </OverlayTrigger>
          </div>
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

          {showForm && (
            <Form onSubmit={invitationHandler} className='py-3'>
              <Form.Group className='mb-3' controlId='formBasicEmail'>
                <Form.Label>
                  {' '}
                  Send an email invitation to add a collaborator
                </Form.Label>
                <Form.Control type='email' placeholder='Enter email' />
                <Form.Text className='text-muted'>
                  The invitation contains all the information about how to sign
                  up on this review: {review.reviewName}
                </Form.Text>
              </Form.Group>

              <Button variant='primary' type='submit'>
                Send invitation
              </Button>
            </Form>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Collaborators;
