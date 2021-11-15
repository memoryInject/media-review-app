import React, { useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import Loader from '../components/Loader';
import Message from '../components/Message';
import FeedbackList from '../components/FeedbackList';
import ReactPlayerComp from '../components/ReactPlayerComp';
import FeedbackForm from '../components/FeedbackForm';
import MediaInfoBar from '../components/MediaInfoBar';
import ReviewButtons from '../components/ReviewButtons';
import VideoUpload from '../components/VideoUpload';
import Playlist from '../components/Playlist';
import Collaborators from '../components/Collaborators';

import { listReviewDetails } from '../actions/reviewActions';
import { PLAYER_RESET } from '../constants/playerConstants';
import { REVIEW_DETAILS_RESET } from '../constants/reviewConstants';
import {
  MEDIA_DETAILS_RESET,
  MEDIA_LIST_RESET,
} from '../constants/mediaConstants';
import {
  FEEDBACK_CREATE_RESET,
  FEEDBACK_LIST_RESET,
} from '../constants/feedbackConstants';
import { PLAYLIST_DETAILS_RESET } from '../constants/playlistConstants';

const ReviewScreen = ({ history, match }) => {
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const reviewDetails = useSelector((state) => state.reviewDetails);
  let { loading, error, review } = reviewDetails;

  useEffect(() => {
    if (!userInfo) {
      history.push('/login');
    } else {
      dispatch({ type: MEDIA_DETAILS_RESET });
      if (
        !review ||
        (review && review.id.toString() !== match.params.reviewId.toString())
      ) {
        dispatch({ type: REVIEW_DETAILS_RESET });
        dispatch({ type: PLAYER_RESET });
        dispatch({ type: MEDIA_LIST_RESET });
        dispatch({ type: PLAYLIST_DETAILS_RESET });
        dispatch({ type: FEEDBACK_LIST_RESET });
        dispatch({ type: FEEDBACK_CREATE_RESET });
        dispatch(listReviewDetails(match.params.reviewId));
      }
    }
  }, [match.params.reviewId, dispatch, history, userInfo, review]);

  return (
    <>
      {(loading && !review) ||
      (loading && review.id.toString() !== match.params.reviewId.toString()) ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          <Row className='top-row flex-fill'>
            <Col className='d-flex flex-column'>
              <div className='vh-75'>
                <Row>
                  <Col>
                    <ReactPlayerComp />
                    <MediaInfoBar />
                    <FeedbackForm />
                  </Col>
                  <Col md={4}>
                    <FeedbackList />
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <Row>
                {review && (
                  <Col md={8} className='py-1'>
                    <Playlist match={match}/>
                  </Col>
                )}
                <Col md={4} className='text-center py-1'>
                  <ReviewButtons history={history} />
                  <VideoUpload match={match} />
                  <Collaborators />
                </Col>
              </Row>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ReviewScreen;
