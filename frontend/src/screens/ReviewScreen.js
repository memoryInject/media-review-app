import React, { useEffect, useState } from 'react';
import { Col, ListGroup, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import Loader from '../components/Loader';
import Message from '../components/Message';
import { listReviewDetails } from '../actions/reviewActions';
import ReactPlayerComp from '../components/ReactPlayerComp';
// import ReactPlayerComp from '../components/ReactPlayerComp';

const ReviewScreen = ({ match }) => {
  const dispatch = useDispatch();

  const reviewDetails = useSelector((state) => state.reviewDetails);
  let { loading, error, review } = reviewDetails;

  const [url, setUrl] = useState(null);

  useEffect(() => {
    dispatch(listReviewDetails(match.params.reviewId));
  }, [match.params.reviewId, dispatch]);

  useEffect(() => {
    if (review && review.media.length > 0) {
      setUrl(review.media[0].asset.url);
    }
    return () => setUrl(null);
  }, [review]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          <Row className='top-row'>
            <Col xs lg='9'>
              <ReactPlayerComp url={url} />
              <div className='text-center my-2 feedback'>
                <h1>Feedback</h1>
              </div>
            </Col>
            <Col xs lg='2' md='auto'>
              <h1>Comments</h1>
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
                      onClick={() => setUrl(m.asset.url)}
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
