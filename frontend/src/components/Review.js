import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Review = ({ review, projectId }) => {
  //const placeholderUrl = '/media/images/placeholder.png'
  const placeholderUrl = 'https://www.btklsby.go.id/images/placeholder/basic.png';  

  return (
    <Card className='my-3 rounded review-card'>
      <Link to={`/projects/${projectId}/reviews/${review.id}`}>
        <Card.Img
          alt='review image'
          src={review.imageUrl ? review.imageUrl : placeholderUrl}
          className='review-img'
          style={{ opacity: `${review.imageUrl ? '1' : '0.4'}` }}
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
          <Row xs='auto'>
            <Col>
              <span
                className='material-icons-round text-light'
                style={{
                  position: 'relative',
                  top: '5px',
                }}
              >
                people
              </span>
              &nbsp;
              <span className='text-light'>{review.numberOfCollaborator}</span>
            </Col>
            <Col>
              <span
                className='material-icons-round text-light'
                style={{
                  position: 'relative',
                  top: '5.5px',
                }}
              >
                videocam
              </span>
              &nbsp;
              <span className='text-light'>{review.numberOfMedia}</span>
            </Col>
            <Col>
              <span
                className={`px-0 my-0 ${
                  review.isOpen ? 'text-muted' : 'text-danger'
                }`}
              >
                {review.isOpen ? (
                  <span
                    className='material-icons-round'
                    style={{
                      position: 'relative',
                      top: '3px',
                    }}
                  >
                    lock_open
                  </span>
                ) : (
                  <span
                    className='material-icons-round'
                    style={{
                      position: 'relative',
                      top: '3px',
                    }}
                  >
                    lock
                  </span>
                )}
                &nbsp;
              </span>
            </Col>
          </Row>
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Review;
