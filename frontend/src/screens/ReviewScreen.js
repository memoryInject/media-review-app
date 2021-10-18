import React, { useEffect, useState } from 'react';
import { Col, ListGroup, Row, Button } from 'react-bootstrap';
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

const ReviewScreen = ({ match }) => {
  const dispatch = useDispatch();

  const reviewDetails = useSelector((state) => state.reviewDetails);
  let { loading, error, review } = reviewDetails;

  const [url, setUrl] = useState(null);

  useEffect(() => {
    dispatch(listReviewDetails(match.params.reviewId));
    return () => dispatch({ type: REVIEW_DETAILS_RESET });
  }, [match.params.reviewId, dispatch]);

  useEffect(() => {
    if (review && review.media.length > 0) {
      setUrl(review.media[0].asset.url);
      dispatch(listMediaDetails(review.media[0].id));
      dispatch(listFeedbacks(review.media[0].id));
    }
    return () => {
      setUrl(null);
      dispatch({ type: FEEDBACK_LIST_RESET });
      dispatch({ type: MEDIA_DETAILS_RESET });
      dispatch({ type: FEEDBACK_CREATE_RESET });
    };
  }, [review, dispatch]);

  const mediaHandler = (media) => {
    setUrl(media.asset.url);
    dispatch(listMediaDetails(media.id));
    dispatch(listFeedbacks(media.id));
    dispatch({ type: FEEDBACK_CREATE_RESET });
  };

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
              <ReactPlayerComp url={url} />
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
                {/*<h6>PLAYLIST</h6>*/}
                {/*<ListGroup horizontal='md'>*/}
                  {/*{review.media.map((m, idx) => (*/}
                    {/*<ListGroup.Item*/}
                      {/*style={{ minHeight: '6rem' }}*/}
                      {/*key={idx}*/}
                      {/*action*/}
                      {/*onClick={() => mediaHandler(m)}*/}
                    {/*>*/}
                      {/*{m.mediaName}*/}
                    {/*</ListGroup.Item>*/}
                  {/*))}*/}
                {/*</ListGroup>*/}
              </Col>
            )}
            <Col md={4} className='text-center'>
              <VideoUpload />
              <Button
                variant='outline-info'
                style={{ minHeight: '6rem', width: '49%' }}
              >
                <span className='material-icons-round'>people</span>
                <h6>Members</h6>
              </Button>{' '}
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ReviewScreen;
