import React from 'react';
import { ListGroup } from 'react-bootstrap';

const CollaboratorDetails = ({ collaborator }) => {
  return (
    <>
      <ListGroup as='ol'>
        <ListGroup.Item
          as='li'
          className='d-flex justify-content-between align-items-start'
        >
          <div className='ms-2 me-auto'>
            <div className='fw-bold text-secondary'>Username</div>
            {collaborator.username}
          </div>
        </ListGroup.Item>
        <ListGroup.Item
          as='li'
          className='d-flex justify-content-between align-items-start'
        >
          <div className='ms-2 me-auto'>
            <div className='fw-bold text-secondary'>Email</div>
            {collaborator.email}
          </div>
        </ListGroup.Item>
        <ListGroup.Item
          as='li'
          className='d-flex justify-content-between align-items-start'
        >
          <div className='ms-2 me-auto'>
            <div className='fw-bold text-secondary'>First name</div>
            {collaborator.firstName}
          </div>
        </ListGroup.Item>
        <ListGroup.Item
          as='li'
          className='d-flex justify-content-between align-items-start'
        >
          <div className='ms-2 me-auto'>
            <div className='fw-bold text-secondary'>Last name</div>
            {collaborator.lastName}
          </div>
        </ListGroup.Item>
        <ListGroup.Item
          as='li'
          className='d-flex justify-content-between align-items-start'
        >
          <div className='ms-2 me-auto'>
            <div className='fw-bold text-secondary'>Company name</div>
            {collaborator.profile.companyName}
          </div>
        </ListGroup.Item>
        {collaborator.profile.isAdmin && (
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
  );
};

export default CollaboratorDetails;
