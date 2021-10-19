import React, { useEffect } from 'react';
import { Col, Row, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import Loader from '../components/Loader';
import Message from '../components/Message';
import FeedbackList from '../components/FeedbackList';
import ReactPlayerComp from '../components/ReactPlayerComp';
import FeedbackForm from '../components/FeedbackForm';
import MediaInfoBar from '../components/MediaInfoBar';

import { listReviewDetails } from '../actions/reviewActions';
import { listFeedbacks } from '../actions/feedbackActions';
import { listMediaDetails } from '../actions/mediaActions';
import {
  FEEDBACK_CREATE_RESET,
  FEEDBACK_LIST_RESET,
} from '../constants/feedbackConstants';
import { REVIEW_DETAILS_RESET } from '../constants/reviewConstants';
import { MEDIA_DETAILS_RESET } from '../constants/mediaConstants';
import VideoUpload from '../components/VideoUpload';
import Playlist from '../components/Playlist';
import Collaborators from '../components/Collaborators';

const ReviewScreen = ({ match }) => {
  const dispatch = useDispatch();

  const reviewDetails = useSelector((state) => state.reviewDetails);
  let { loading, error, review } = reviewDetails;

  useEffect(() => {
    dispatch(listReviewDetails(match.params.reviewId));
    return () => dispatch({ type: REVIEW_DETAILS_RESET });
  }, [match.params.reviewId, dispatch]);

  useEffect(() => {
    if (review && review.media.length > 0) {
      dispatch(listMediaDetails(review.media[0].id));
      dispatch(listFeedbacks(review.media[0].id));
    }
    return () => {
      dispatch({ type: FEEDBACK_LIST_RESET });
      dispatch({ type: MEDIA_DETAILS_RESET });
      dispatch({ type: FEEDBACK_CREATE_RESET });
    };
  }, [review, dispatch]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          <Row>
            <Col>
              <MediaInfoBar />
            </Col>
          </Row>
          <Row className='top-row'>
            <Col>
              <ReactPlayerComp />
              <FeedbackForm />
            </Col>
            <Col md={4}>
              <FeedbackList />
            </Col>
          </Row>
          <Row>
            {review && (
              <Col md={8}>
                <Playlist />
              </Col>
            )}
            <Col md={4} className='text-center'>
              <VideoUpload />
              <Collaborators />
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ReviewScreen;
