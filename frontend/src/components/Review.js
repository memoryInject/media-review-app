import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Review = ({ review, projectId }) => {
  return (
    <Card className='my-3 rounded review-card'>
      <Link to={`/projects/${projectId}/reviews/${review.id}`}>
        <Card.Img src={review.imageUrl} className='review-img' />
      </Link>
      <Card.Body>
        <Link to={`/projects/${projectId}/reviews/${review.id}`}>
          <Card.Title>{review.name}</Card.Title>
        </Link>
        <Card.Text as='div'>
          <p>{review.items} items</p>
          <p className='py-0 my-0'>{review.active ? 'Active' : 'Closed'}</p>
          <span>{review.users} members</span>
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Review;
