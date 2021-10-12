import React, { useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import { createFeedback } from '../actions/feedbackActions';
import {
  drawableTypeAnnotation,
  isEmptyAnnotation,
  setColorAnnotation,
  setActiveAnnotation,
} from '../actions/annotationActions';

const FeedbackForm = () => {
  const [feedback, setFeedback] = useState('');
  const [showColorPalette, setShowColorPalette] = useState(false);

  const dispatch = useDispatch();

  const annotationDeatils = useSelector((state) => state.annotationDeatils);
  let { drawableType, color, active } = annotationDeatils;

  const mediaDetails = useSelector((state) => state.mediaDetails);
  let { media } = mediaDetails;

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      createFeedback({
        media: media.id,
        content: feedback,
        mediaTime: 5.0,
      })
    );
  };

  const drawableTypeHandler = (type) => {
    if (!active) {
      dispatch(setActiveAnnotation(true));
    }
    dispatch(drawableTypeAnnotation(type));
  };

  const clearAnnotationHandler = () => {
    dispatch(isEmptyAnnotation(true));
    dispatch(setActiveAnnotation(false));
  };

  return (
    <Row className='justify-content-md-center'>
      <Col md={8}>
        <div
          className='my-2 p-3'
          style={{
            backgroundColor: '#303030',
            borderRadius: '.25rem',
            //marginLeft: '12rem',
            //marginRight: '12rem',
            width: '100%',
            display: 'inline-block',
          }}
        >
          <Form onSubmit={submitHandler}>
            <Form.Group controlId='email'>
              <Form.Control
                as='textarea'
                rows={2}
                placeholder='Write feedback...'
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className='text-white'
                style={{
                  backgroundColor: '#3A3A3A',
                  border: '0px',
                }}
              ></Form.Control>
            </Form.Group>
            <Button
              type='submit'
              variant='primary'
              className='float-end'
              style={{
                marginTop: '0.65rem',
              }}
            >
              POST
            </Button>
          </Form>

          {/*Canvas Draw Options Start*/}
          <div
            style={{
              marginTop: '1.0rem',
              top: '-6px',
              border: '1px solid #222222',
              borderRadius: '0.25rem',
              display: 'inline-block',
            }}
          >
            {/*TODO: refactor onClick action and set active annotation*/}
            <span
              className='material-icons-round noselect'
              style={{
                cursor: 'pointer',
                padding: '0 0.65rem',
                color: `${
                  drawableType === 'CircleDrawable' && active
                    ? '#FFFFFF'
                    : '#222222'
                }`,
              }}
              onClick={() => drawableTypeHandler('CircleDrawable')}
            >
              radio_button_unchecked
            </span>

            <span
              className='material-icons-round noselect'
              style={{
                //transform: 'rotate(-45deg)',
                cursor: 'pointer',
                fontSize: '28px',
                padding: '0 0.65rem',
                color: `${
                  drawableType === 'ArrowDrawable' && active
                    ? '#FFFFFF'
                    : '#222222'
                }`,
              }}
              onClick={() => drawableTypeHandler('ArrowDrawable')}
            >
              trending_flat
            </span>

            <span
              className='material-icons-round noselect'
              style={{
                cursor: 'pointer',
                padding: '0 0.65rem',
                color: `${
                  drawableType === 'FreePathDrawable' && active
                    ? '#FFFFFF'
                    : '#222222'
                }`,
              }}
              onClick={() => drawableTypeHandler('FreePathDrawable')}
            >
              brush
            </span>
            <span
              className='material-icons-round noselect'
              style={{
                cursor: 'pointer',
                padding: '0 0.65rem',
                color: '#E74C3C',
              }}
              onClick={clearAnnotationHandler}
            >
              highlight_off
            </span>
            <span
              className='material-icons-round noselect'
              style={{
                cursor: 'pointer',
                padding: '0 0.65rem',
                color: color,
              }}
              onClick={() => setShowColorPalette(!showColorPalette)}
            >
              circle
            </span>
          </div>

          {/*Color Palette Start*/}
          <div
            style={{
              //backgroundColor: '#222222',
              borderRadius: '0.25rem',
              marginTop: '0.4rem',
              display: `${showColorPalette ? 'block' : 'none'}`,
            }}
            className='text-center'
          >
            <span
              className='material-icons-round noselect'
              style={{
                cursor: 'pointer',
                padding: '0.4rem 0.2rem',
                color: '#E74C3C',
              }}
              onClick={() => dispatch(setColorAnnotation('#E74C3C'))}
            >
              circle
            </span>
            <span
              className='material-icons-round noselect'
              style={{
                cursor: 'pointer',
                padding: '0.4rem 0.2rem',
                color: '#F38D1C',
              }}
              onClick={() => dispatch(setColorAnnotation('#F38D1C'))}
            >
              circle
            </span>
            <span
              className='material-icons-round noselect'
              style={{
                cursor: 'pointer',
                padding: '0.4rem 0.2rem',
                color: '#00BC71',
              }}
              onClick={() => dispatch(setColorAnnotation('#00BC71'))}
            >
              circle
            </span>
            <span
              className='material-icons-round noselect'
              style={{
                cursor: 'pointer',
                padding: '0.4rem 0.2rem',
                color: '#3498DB',
              }}
              onClick={() => dispatch(setColorAnnotation('#3498DB'))}
            >
              circle
            </span>
            <span
              className='material-icons-round noselect'
              style={{
                cursor: 'pointer',
                padding: '0.4rem 0.2rem',
                color: '#841397',
              }}
              onClick={() => dispatch(setColorAnnotation('#841397'))}
            >
              circle
            </span>
            <span
              className='material-icons-round noselect'
              style={{
                cursor: 'pointer',
                padding: '0.4rem 0.2rem',
                color: 'white',
              }}
              onClick={() => dispatch(setColorAnnotation('white'))}
            >
              circle
            </span>
            <span
              className='material-icons-round noselect'
              style={{
                cursor: 'pointer',
                padding: '0.4rem 0.2rem',
                color: 'black',
              }}
              onClick={() => dispatch(setColorAnnotation('black'))}
            >
              circle
            </span>
          </div>
          {/*Color Palette end*/}
          {/*Canvas Draw Options End*/}
        </div>
      </Col>
    </Row>
  );
};

export default FeedbackForm;
