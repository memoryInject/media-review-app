import React, { useState, useEffect } from 'react';
import {
  Button,
  Spinner,
  Modal,
  Container,
  Row,
  Col,
  ProgressBar,
} from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';

import Message from '../components/Message';
import { showToast, messageToast, variantToast } from '../actions/toastActions';
import CaptureAudio from '../utils/captureAudio';

const TranscriptModal = ({ show, onHide, onSuccess }) => {
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const [startRecord, setStartRecord] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [transcriptActive, setTranscriptActive] = useState(false);
  const [blob, setBlob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progressMessage, setProgressMessage] = useState('');
  const [progressRate, setProgressRate] = useState(0);

  let recordAudio = CaptureAudio;
  recordAudio.setBlobHandler(setBlob);
  recordAudio.setErrorHandler(setErrorMessage);

  // This will run if any errorMessage from recordAudio
  useEffect(() => {
    if (errorMessage) {
      console.log('errorMessage', errorMessage);
      setStartRecord(false);
      setTranscriptActive(false);
    }
  }, [errorMessage]);

  // This will run if blob is created by recordAudio
  useEffect(() => {
    // Get transcript from backend
    const getTranscipt = async (blob) => {
      console.log('Get transcript', blob);
      const formData = new FormData();
      formData.append('audio', blob);
      formData.append('mimetype', 'audio/webm');

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Token ${userInfo.key}`,
        },
      };

      setProgressRate(50);
      setProgressMessage('Ready for transcript...');

      try {
        if (blob) {
          // Dummy url for test only
          let url = '/api/v1/transcript/';
          url = '/api/v1/transcript/dummy/';

          setProgressRate(75);
          setProgressMessage('Deepgram AI process...');

          const { data } = await axios.post(url, formData, config);
          console.log(data);
          setProgressRate(100);
          setProgressMessage('Success...');
          onSuccess(data.transcript);
          onHide();
          setLoading(false);
          setProgressRate(0);
          setProgressMessage('');

          // Show toast on success
          dispatch(messageToast('Deepgram: transcript success'));
          dispatch(variantToast('success'));
          dispatch(showToast(true));
        }
      } catch (error) {
        setProgressRate(0);
        setProgressMessage('');
        setLoading(false);
        console.log(error);
      }
    };

    //console.log('blob', blob);
    if (blob) {
      if (transcriptActive) {
        console.log('Ready for transcript');
        getTranscipt(blob);
        setTranscriptActive(false);
      }
      setBlob(null);
    }
  }, [blob, transcriptActive, userInfo, onSuccess, onHide, dispatch]);

  // This will handle Close and Cancel function
  const closeHandler = () => {
    // If transcriptActive then it's Cancel
    setLoading(false);
    setProgressRate(0);
    setProgressMessage('');
    setErrorMessage('');
    if (transcriptActive) {
      setTranscriptActive(false);
      recordAudio.stopRecording();
      setStartRecord(!startRecord);
    } else {
      onHide();
    }
  };

  const onHideHandler = () => {
    closeHandler();
    onHide();
  };

  // This will handle Start and Stop recording function
  const submitHandler = () => {
    setErrorMessage('');
    if (!startRecord) {
      setStartRecord(!startRecord);
      recordAudio.startRecording();
      setTranscriptActive(true);
    } else {
      setStartRecord(!startRecord);
      if (recordAudio) {
        recordAudio.stopRecording();
        setLoading(true);
        setProgressRate(25);
        setProgressMessage('Prepare audio...');
      } else {
        console.log('No recordAudio: ', recordAudio);
      }
    }
  };

  return (
    <>
      <Modal
        show={show}
        onHide={onHideHandler}
        aria-labelledby='contained-modal-title-vcenter'
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id='contained-modal-title-vcenter'>
            <span
              className='material-icons-round'
              style={{ transform: 'translate(0, 4px)' }}
            >
              movie
            </span>
            &nbsp; Speech to text
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            {loading ? (
              <>
                <Row className='justify-content-center'>
                  <Col xs='auto'>
                    {true && (
                      <div
                        style={{
                          marginTop: '1.0rem',
                          marginBottom: '0.75rem',
                        }}
                      >
                        <Spinner animation='border' />
                      </div>
                    )}
                  </Col>
                </Row>
                <Row className='justify-content-center'>
                  <Col>
                    {true && (
                      <div
                        style={{
                          marginTop: '1rem',
                        }}
                      >
                        <ProgressBar
                          animated
                          now={progressRate}
                          label={progressMessage}
                        />
                      </div>
                    )}
                  </Col>
                </Row>
              </>
            ) : (
              <Row className='justify-content-center'>
                <Col xs='auto'>
                  <div
                    style={{
                      marginTop: '2rem',
                    }}
                  >
                    <>
                      {startRecord && (
                        <div
                          style={{
                            position: 'relative',
                            transform: 'translate(5px, 5px)',
                            zIndex: '0',
                          }}
                        >
                          <div className='circle_ripple'></div>
                          <div className='circle_ripple-2'></div>
                        </div>
                      )}
                      <div
                        style={{
                          width: '60px',
                          height: '60px',
                          borderRadius: '50%',
                          background: '#EAEAEA',
                          position: 'relative',
                          left: '0',
                          top: '0',
                        }}
                      >
                        <div
                          style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '50%',
                            background: '#fafafa',
                            position: 'relative',
                            left: '5px',
                            top: '5px',
                          }}
                        >
                          <span
                            className='material-icons-round noselect'
                            style={{
                              //transform: 'rotate(-45deg)',
                              transform: 'translate(11px, 12px)',
                              fontSize: '28px',
                              //padding: '0 0.65rem',
                              position: 'relative',
                              color: '#a7a7a7',
                            }}
                          >
                            mic
                          </span>
                        </div>
                      </div>
                    </>
                  </div>
                </Col>
              </Row>
            )}
          </Container>
          <p
            className='text-center text-muted'
            style={{
              marginTop: '2rem',
              marginBottom: '0px',
            }}
          >
            Powered by
            <a href='https://deepgram.com/' target='_blank' rel='noreferrer'>
              &nbsp;Deepgram
            </a>{' '}
            AI
          </p>
          <div
            style={{
              marginTop: '2rem',
              marginBottom: '0px',
            }}
          >
            {errorMessage && <Message>{errorMessage}</Message>}
          </div>
        </Modal.Body>
        <>
          <Modal.Footer>
            <Button
              onClick={closeHandler}
              variant='danger'
              disabled={loading ? true : false}
            >
              {startRecord ? 'Cancel' : 'Close'}
            </Button>
            {loading ? (
              <Button
                variant='primary'
                disabled
                style={{
                  height: '39px',
                }}
              >
                <Spinner
                  as='span'
                  animation='grow'
                  size='sm'
                  role='status'
                  aria-hidden='true'
                />
                &nbsp;&nbsp;Loading...
              </Button>
            ) : (
              <Button
                data-cy='submit'
                variant='primary'
                onClick={submitHandler}
                style={{
                  height: '39px',
                }}
              >
                {startRecord ? (
                  <>
                    <span
                      className='material-icons-round noselect'
                      style={{
                        fontSize: '28px',
                        position: 'relative',
                        transform: 'scale(1.2)',
                        right: '3px',
                        top: '-1px',
                      }}
                    >
                      stop
                    </span>

                    <span
                      style={{
                        position: 'relative',
                        top: '-9px',
                      }}
                      className='fw-bold'
                    >
                      Stop Record
                    </span>
                  </>
                ) : (
                  <>
                    <span
                      className='material-icons-round noselect'
                      style={{
                        fontSize: '28px',
                        position: 'relative',
                        transform: 'scale(1.0)',
                        right: '3px',
                        top: '-1px',
                      }}
                    >
                      fiber_manual_record
                    </span>

                    <span
                      style={{
                        position: 'relative',
                        top: '-9px',
                      }}
                      className='fw-bold'
                    >
                      Start Record
                    </span>
                  </>
                )}
              </Button>
            )}
          </Modal.Footer>
        </>
      </Modal>
    </>
  );
};

export default TranscriptModal;
