import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row } from 'react-bootstrap';

import Review from '../components/Review';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { listProjectDetails } from '../actions/projectActions';

const ProjectScreen = ({ match, history }) => {
  const dispatch = useDispatch();

  const projectDetails = useSelector((state) => state.projectDetails);
  const { loading, error, project } = projectDetails;

  useEffect(() => {
    dispatch(listProjectDetails(match.params.id));
  }, [match.params.id, dispatch]);

  return (
    <div>
      <h4>{project.projectName}</h4>
      <h6 style={{fontSize: '12px'}}>REVIEWS:</h6>
      <Row>
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error}</Message>
        ) : (
          project.reviews &&
          project.reviews.map((review) => (
            <Col sm={12} md={6} lg={5} xl={4} key={review.id.toString()}>
              <Review projectId={match.params.id} review={review} />
            </Col>
          ))
        )}
      </Row>
    </div>
  );
};

export default ProjectScreen;
