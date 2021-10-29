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
        <Link
          to={`/projects/${projectId}/reviews/${review.id}`}
          style={{ textDecoration: 'none' }}
        >
          <Card.Title className='title-card'>{review.reviewName}</Card.Title>
        </Link>
        <Card.Text as='div'>
          <p className='py-0 text-muted' style={{marginBottom: '10px'}}>{review.items} items</p>
          <p className='py-0 my-0 text-muted'>{review.active ? 'Active' : 'Closed'}</p>
          <span className='text-muted'>{review.users} collaborators</span>
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Review;
