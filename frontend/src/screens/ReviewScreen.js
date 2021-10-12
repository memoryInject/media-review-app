import React, { useEffect, useState } from 'react';
import { Col, ListGroup, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import Loader from '../components/Loader';
import Message from '../components/Message';
import FeedbackList from '../components/FeedbackList';
import ReactPlayerComp from '../components/ReactPlayerComp';
import FeedbackForm from '../components/FeedbackForm';

import { listReviewDetails } from '../actions/reviewActions';
import { listFeedbacks } from '../actions/feedbackActions';
import { listMediaDetails } from '../actions/mediaActions';
import { FEEDBACK_LIST_RESET } from '../constants/feedbackConstants';
import { REVIEW_DETAILS_RESET } from '../constants/reviewConstants';
import { MEDIA_DETAILS_RESET } from '../constants/mediaConstants';

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
    };
  }, [review, dispatch]);

  const mediaHandler = (media) => {
    setUrl(media.asset.url);
    dispatch(listMediaDetails(media.id));
    dispatch(listFeedbacks(media.id));
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          <Row className='top-row'>
            <Col xs={12} md={9}>
              <ReactPlayerComp url={url} />
              <FeedbackForm />
            </Col>
            <Col>
              <FeedbackList />
            </Col>
          </Row>
          <Row>
            {review && (
              <Col>
                {/*<h6>PLAYLIST</h6>*/}
                <ListGroup horizontal='md'>
                  {review.media.map((m, idx) => (
                    <ListGroup.Item
                      style={{ minHeight: '6rem' }}
                      key={idx}
                      action
                      onClick={() => mediaHandler(m)}
                    >
                      {m.mediaName}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Col>
            )}
          </Row>
        </>
      )}
    </>
  );
};

export default ReviewScreen;
