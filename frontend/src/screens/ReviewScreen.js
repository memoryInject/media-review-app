import React from 'react';
import { Col, Row } from 'react-bootstrap';

import Review from '../components/Review';

import projects from '../projects';
import reviews from '../reviews';

const ReviewScreen = ({ match }) => {
  const project = projects.find((p) => p.id.toString() === match.params.id);
  const projectReviews = reviews.filter(
    (r) => r.projectId.toString() === match.params.id
  );

  return (
    <div>
      <h1>{project.name} Reviews</h1>
      <Row>
        {projectReviews.map((review) => (
          <Col sm={12} md={6} lg={4} xl={3}>
            <Review review={review} projectId={match.params.id} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ReviewScreen;
