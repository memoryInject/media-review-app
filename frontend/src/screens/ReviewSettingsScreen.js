import React, { useState, useEffect } from 'react';
import { Row, Col, Container, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import Loader from '../components/Loader';
import Message from '../components/Message';
import Collaborators from '../components/Collaborators';

import ReviewUpdateDeleteForm from '../components/ReviewUpdateDeleteForm';
import ReviewMediaListTable from '../components/ReviewMediaListTable';
import { showUICollaborator } from '../actions/collaboratorActions';
import { listReviewDetails } from '../actions/reviewActions';

const ReviewSettingsScreen = ({ history, match }) => {
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userDetails = useSelector((state) => state.userDetails);
  const { user } = userDetails;

  const reviewDetails = useSelector((state) => state.reviewDetails);
  let { loading, error, review } = reviewDetails;

  const [showMediaList, setShowMediaList] = useState(false);

  useEffect(() => {
    if (!userInfo) {
      history.push('/login');
    } else {
      dispatch(listReviewDetails(match.params.reviewId));
    }
  }, [history, match, userInfo, dispatch]);

  return (
    <div>
      <Row style={{ marginBottom: '0.5rem' }}>
        <Col>
          <h5>
            <span
              style={{ position: 'relative', top: '5px' }}
              className='material-icons-round'
            >
              construction
            </span>
            &nbsp;
            <strong>Review Settings</strong>
          </h5>
        </Col>
        <Col xs='auto' className='text-end'>
          <Button
            style={{ paddingTop: '0px' }}
            variant='primary'
            onClick={() => dispatch(showUICollaborator())}
          >
            <span
              style={{
                transform: 'translate(0, 4px)',
              }}
              className='material-icons-round'
            >
              people
            </span>
            &nbsp;
            <span>Collaborators</span>
          </Button>
        </Col>
      </Row>
      <Row
        xs='auto'
        style={{ cursor: 'pointer', paddingBottom: '1rem' }}
        className='dflex justify-content-center text-success'
      >
        <Col className='py-1'>
          {showMediaList ? (
            <span onClick={() => setShowMediaList(false)}>Details</span>
          ) : (
            <span>
              <strong>Details</strong>
            </span>
          )}
        </Col>
        <Col className='py-1'>
          {showMediaList ? (
            <span>
              <strong>Media list</strong>
            </span>
          ) : (
            <span
              onClick={() => setShowMediaList(true)}
            >
              Media list
            </span>
          )}
        </Col>
      </Row>
      {error && <Message>{error}</Message>}
      {loading ? (
        <Loader />
      ) : (
        review &&
        userDetails && (
          <>
            <Collaborators />
            <Container>
              <Row className='dflex justify-content-center'>
                {!showMediaList && (
                  <Col
                    xs={12}
                    md={12}
                    lg={6}
                    className='bg-dark py-2'
                    style={{ borderRadius: '0.25rem' }}
                  >
                    {/*Form to update/delete the review*/}
                    <ReviewUpdateDeleteForm
                      history={history}
                      match={match}
                      review={review}
                      userDetails={userDetails}
                    />
                  </Col>
                )}
              </Row>
              <Row className='dflex justify-content-center'>
                {showMediaList && (
                  <Col
                    xs='auto'
                    className='bg-dark py-2'
                    style={{ borderRadius: '0.25rem' }}
                  >
                    {/*Table to show review list of this project*/}
                    <ReviewMediaListTable
                      history={history}
                      match={match}
                      review={review}
                      userDetails={userDetails}
                    />
                  </Col>
                )}
              </Row>
            </Container>
          </>
        )
      )}
    </div>
  );
};

export default ReviewSettingsScreen;
