import React from 'react';
import { ListGroup } from 'react-bootstrap';

const UserProfileListGroup = ({ user }) => {
  return (
    <ListGroup as='ol'>
      <ListGroup.Item
        as='li'
        className='d-flex justify-content-between align-items-start'
      >
        <div className='ms-2 me-auto'>
          <div className='text-light'>Username</div>
          <h5 className='px-2'>{user.username}</h5>
        </div>
      </ListGroup.Item>
      <ListGroup.Item
        as='li'
        className='d-flex justify-content-between align-items-start'
      >
        <div className='ms-2 me-auto'>
          <div className='text-light'>Email</div>
          <h5 className='px-2'>{user.email}</h5>
        </div>
      </ListGroup.Item>
      <ListGroup.Item
        as='li'
        className='d-flex justify-content-between align-items-start'
      >
        <div className='ms-2 me-auto'>
          <div className='text-light'>First name</div>
          <h5 className='px-2'>{user.firstName}</h5>
        </div>
      </ListGroup.Item>
      <ListGroup.Item
        as='li'
        className='d-flex justify-content-between align-items-start'
      >
        <div className='ms-2 me-auto'>
          <div className='text-light'>Last name</div>
          <h5 className='px-2'>{user.lastName}</h5>
        </div>
      </ListGroup.Item>
      <ListGroup.Item
        as='li'
        className='d-flex justify-content-between align-items-start'
      >
        <div className='ms-2 me-auto'>
          <div className='text-light'>Company name</div>
          <h5 className='px-2'>
            {user.profile.companyName ? user.profile.companyName : ''}
          </h5>
        </div>
      </ListGroup.Item>
      <ListGroup.Item
        as='li'
        className='d-flex justify-content-between align-items-start'
      >
        <div className='ms-2 me-auto'>
          <div className='text-light'>Admin access</div>
          <h5 className='px-2'>
            {user.profile.isAdmin ? (
              <span className='material-icons-round text-success'>
                check_box
              </span>
            ) : (
              <span className='material-icons-round text-danger'>
                disabled_by_default
              </span>
            )}
          </h5>
        </div>
      </ListGroup.Item>
    </ListGroup>
  );
};

export default UserProfileListGroup;
