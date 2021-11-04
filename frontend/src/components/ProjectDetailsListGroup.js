import React from 'react';
import { ListGroup } from 'react-bootstrap';

const ProjectDetailsListGroup = ({project}) => {
  return(
    <ListGroup as='ol'>
      <ListGroup.Item
        as='li'
        className='d-flex justify-content-between align-items-start'
      >
        <div className='ms-2 me-auto'>
          <div className='text-light'>Id</div>
          <h5 className='px-2'>{project.id}</h5>
        </div>
      </ListGroup.Item>
      <ListGroup.Item
        as='li'
        className='d-flex justify-content-between align-items-start'
      >
        <div className='ms-2 me-auto'>
          <div className='text-light'>Name</div>
          <h5 className='px-2'>{project.projectName}</h5>
        </div>
      </ListGroup.Item>
      <ListGroup.Item
        as='li'
        className='d-flex justify-content-between align-items-start'
      >
        <div className='ms-2 me-auto'>
          <div className='text-light'>Creator</div>
          <h5 className='px-2'>{project.user.username}</h5>
        </div>
      </ListGroup.Item>
      <ListGroup.Item
        as='li'
        className='d-flex justify-content-between align-items-start'
      >
        <div className='ms-2 me-auto'>
          <div className='text-light'>Reviews</div>
          <h5 className='px-2'>{project.reviews.length}</h5>
        </div>
      </ListGroup.Item>
    </ListGroup>
  )
}

export default ProjectDetailsListGroup
