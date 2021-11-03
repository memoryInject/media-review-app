import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Review = ({ review, projectId }) => {
  const placeholderUrl =
    'https://www.btklsby.go.id/images/placeholder/basic.png';
  return (
    <Card className='my-3 rounded review-card'>
      <Link to={`/projects/${projectId}/reviews/${review.id}`}>
        <Card.Img
          src={review.imageUrl ? review.imageUrl : placeholderUrl}
          className='review-img'
          style={{opacity: `${review.imageUrl ? '1' : '0.4'}`}}
        />
      </Link>
      <Card.Body>
        <Link
          to={`/projects/${projectId}/reviews/${review.id}`}
          style={{ textDecoration: 'none' }}
        >
          <Card.Title className='title-card'>{review.reviewName}</Card.Title>
        </Link>
        <Card.Text as='div'>
          <p className='py-0 text-muted' style={{ marginBottom: '10px' }}>
            {review.items} items
          </p>
          <p className='py-0 my-0 text-muted'>
            {review.active ? 'Active' : 'Closed'}
          </p>
          <span className='text-muted'>{review.users} collaborators</span>
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Review;
