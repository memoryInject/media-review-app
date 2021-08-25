import React from 'react';
import { Col, Row } from 'react-bootstrap';
import ReactPlayer from 'react-player';

// import ReactPlayerComp from '../components/ReactPlayerComp';

const ReviewDetailScreen = () => {
  const url =
    'https://media.istockphoto.com/videos/beautiful-universally-cloudscape-background-time-lapse-video-id1156186888';
  return (
    <>
      <Row className='top-row'>
        <Col xs lg='8'>
          <div className='player-wrapper'>
            <ReactPlayer url={url} width='100%' height='100%' />
          </div>
          <div className='text-center my-3 feedback'>
            <h1>Feedback</h1>
          </div>
        </Col>
        <Col xs lg='2' md='auto'>
          <h1>Comments</h1>
        </Col>
      </Row>
      <Row>
        <Col className='play-list-bottom'>
          <h1>Playlist</h1>
        </Col>
      </Row>
    </>
  );
};

export default ReviewDetailScreen;
