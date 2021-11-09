import React from 'react';
import { ListGroup } from 'react-bootstrap';

const ReviewDetailsListGroup = ({ review }) => {
  return (
    <ListGroup as='ol'>
      <ListGroup.Item
        as='li'
        className='d-flex justify-content-between align-items-start'
      >
        <div className='ms-2 me-auto'>
          <div className='text-light'>Id</div>
          <h5 className='px-2'>{review.id}</h5>
        </div>
      </ListGroup.Item>
      <ListGroup.Item
        as='li'
        className='d-flex justify-content-between align-items-start'
      >
        <div className='ms-2 me-auto'>
          <div className='text-light'>Name</div>
          <h5 className='px-2'>{review.reviewName}</h5>
        </div>
      </ListGroup.Item>
      <ListGroup.Item
        as='li'
        className='d-flex justify-content-between align-items-start'
      >
        <div className='ms-2 me-auto'>
          <div className='text-light'>Description</div>
          <h5 className='px-2'>{review.description}</h5>
        </div>
      </ListGroup.Item>
      <ListGroup.Item
        as='li'
        className='d-flex justify-content-between align-items-start'
      >
        <div className='ms-2 me-auto'>
          <div className='text-light'>Creator</div>
          <h5 className='px-2'>{review.user.username}</h5>
        </div>
      </ListGroup.Item>
      <ListGroup.Item
        as='li'
        className='d-flex justify-content-between align-items-start'
      >
        <div className='ms-2 me-auto'>
          <div className='text-light'>Media</div>
          <h5 className='px-2'>{review.media.length}</h5>
        </div>
      </ListGroup.Item>
      <ListGroup.Item
        as='li'
        className='d-flex justify-content-between align-items-start'
      >
        <div className='ms-2 me-auto'>
          <div className='text-light'>Collaborators</div>
          <h5 className='px-2'>{review.collaborators.length}</h5>
        </div>
      </ListGroup.Item>
      <ListGroup.Item
        as='li'
        className='d-flex justify-content-between align-items-start'
      >
        <div className='ms-2 me-auto'>
          <div className='text-light'>Status</div>
          <h5
            className={
              review.isOpen
                ? 'text-success fw-bold px-2'
                : 'text-danger fw-bold px-2'
            }
          >
            {review.isOpen ? 'Open' : 'Close'}
          </h5>
        </div>
      </ListGroup.Item>
    </ListGroup>
  );
};

export default ReviewDetailsListGroup;
