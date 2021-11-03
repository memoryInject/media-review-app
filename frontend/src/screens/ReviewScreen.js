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
import { listFeedbacks } from '../actions/feedbackActions';
import { listMediaDetails } from '../actions/mediaActions';
import { PLAYER_RESET } from '../constants/playerConstants';
import { REVIEW_DETAILS_RESET } from '../constants/reviewConstants';
import { MEDIA_DETAILS_RESET } from '../constants/mediaConstants';
import {
  FEEDBACK_CREATE_RESET,
  FEEDBACK_LIST_RESET,
} from '../constants/feedbackConstants';

const ReviewScreen = ({ history, match }) => {
  const dispatch = useDispatch();

  const reviewDetails = useSelector((state) => state.reviewDetails);
  let { loading, error, review } = reviewDetails;

  const playlistDetails = useSelector((state) => state.playlistDetails);
  const { playlist: playlistDetail } = playlistDetails;

  useEffect(() => {
    dispatch(listReviewDetails(match.params.reviewId));
    return () => dispatch({ type: REVIEW_DETAILS_RESET });
  }, [match.params.reviewId, dispatch]);

  useEffect(() => {
    if (review && playlistDetail && playlistDetail.length > 0) {
      if (playlistDetail[0].child) {
        dispatch(listMediaDetails(playlistDetail[0].child[0].id));
        dispatch(listFeedbacks(playlistDetail[0].child[0].id));
      } else {
        dispatch(listMediaDetails(playlistDetail[0].id));
        dispatch(listFeedbacks(playlistDetail[0].id));
      }
    }

    return () => {
      dispatch({ type: FEEDBACK_LIST_RESET });
      dispatch({ type: MEDIA_DETAILS_RESET });
      dispatch({ type: FEEDBACK_CREATE_RESET });
      dispatch({ type: PLAYER_RESET });
    };
  }, [review, dispatch, playlistDetail]);

  return (
    <>
      {loading ? (
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
                    <Playlist />
                  </Col>
                )}
                <Col md={4} className='text-center py-1'>
                  <ReviewButtons history={history} />
                  <VideoUpload />
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
