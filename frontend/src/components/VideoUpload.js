import React, { useState, useRef, useEffect } from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Button, Form, Row, Col, ProgressBar } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';

import Loader from './Loader';
import Message from './Message';

import { showToast, messageToast, variantToast } from '../actions/toastActions';
import { createMedia, updateMedia, listMedia } from '../actions/mediaActions';
import {
  MEDIA_CREATE_HIDE,
  MEDIA_CREATE_PARENT_RESET,
  MEDIA_CREATE_RESET,
  MEDIA_UPDATE_RESET,
} from '../constants/mediaConstants';

const VideoUpload = ({ match }) => {
  const dispatch = useDispatch();

  const filePick = useRef(null);

  const [showButton, setShowButton] = useState(true);
  const [showUpdate, setShowUpdate] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(35);
  const [progressMessage, setProgressMessage] = useState(
    'Uploading video it may take a while'
  );
  const [successMessage, setSuccessMessage] = useState(false);

  const [mediaName, setMediaName] = useState('');
  const [mediaVersion, setMediaVersion] = useState(0);

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userDetails = useSelector((state) => state.userDetails);
  const { user } = userDetails;

  const reviewDetails = useSelector((state) => state.reviewDetails);
  const { review } = reviewDetails;

  const mediaCreate = useSelector((state) => state.mediaCreate);
  const {
    loading: mediaLoading,
    error: mediaError,
    media,
    parent,
    show,
  } = mediaCreate;

  const mediaUpdate = useSelector((state) => state.mediaUpdate);
  const {
    loading: mediaUpdateLoading,
    error: mediaUpdateError,
    media: mediaUpdated,
  } = mediaUpdate;

  // Reset all the state when open upload window
  useEffect(() => {
    const userCheck = () => {
      const filterdUser = review.collaborators.filter(coll => coll.id === user.id)
      if (!filterdUser.length) {
        dispatch({ type: MEDIA_CREATE_HIDE });
        dispatch(messageToast('User is not a collaborator'));
        dispatch(variantToast('danger'));
        dispatch(showToast(true));
      }
    }

    if (show) {
      userCheck()
      setShowButton(true);
      setUploading(false);
      setShowUpdate(false);
      setSuccessMessage(false);
      setProgress(35);
      setProgressMessage('Uploading video it may take a while');
      setMediaName('');
      setMediaVersion(0);
      dispatch({ type: MEDIA_CREATE_RESET });
      dispatch({ type: MEDIA_UPDATE_RESET });
    }
  }, [show, dispatch, review, user]);

  // This will run after the media created successfully
  useEffect(() => {
    if (media) {
      setMediaName(media.mediaName);
      setMediaVersion(media.version);
      setShowUpdate(true);
      setSuccessMessage(true);
    }
  }, [media, dispatch, match]);

  // This will run after the media updated successfully
  useEffect(() => {
    if (mediaUpdated) {
      dispatch({ type: MEDIA_CREATE_HIDE });
      dispatch({ type: MEDIA_CREATE_PARENT_RESET });
      dispatch({ type: MEDIA_UPDATE_RESET });
      dispatch(messageToast('Media updated successfully'));
      dispatch(variantToast('success'));
      dispatch(showToast(true));
      dispatch(listMedia(match.params.reviewId))
    }
  }, [mediaUpdated, dispatch, match]);

  const closeUIHandler = () => {
    dispatch({ type: MEDIA_CREATE_HIDE });
    dispatch({ type: MEDIA_CREATE_PARENT_RESET });
    if (showUpdate) {
      dispatch(listMedia(match.params.reviewId))
    }
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('video', file);

    setUploading(true);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Token ${userInfo.key}`,
      },
    };

    try {
      // TODO: replace dummy url
      if (file) {
        setShowButton(false);
        const { data } = await axios.post(
          '/api/v1/cloud/upload/dummy/',
          formData,
          config
        );

        if (parent) {
          dispatch(
            createMedia({
              mediaName: data.assetName,
              asset: data.id,
              review: review.id,
              mediaType: data.resourceType,
              parent: parent.id,
              version: parent.child
                ? parent.child[0].version + 1
                : parent.version + 1,
            })
          );
        } else {
          dispatch(
            createMedia({
              mediaName: data.assetName,
              asset: data.id,
              review: review.id,
              mediaType: data.resourceType,
            })
          );
        }
      }
      setUploading(false);
      setProgress(70);
      setProgressMessage('Creating media');
    } catch (error) {
      console.log(error);
      setShowButton(true);
      setUploading(false);
    }
  };

  const mediaUpdateHandler = (e) => {
    e.preventDefault();
    setShowUpdate(false);
    setSuccessMessage(false);
    dispatch(updateMedia(media.id, { mediaName, version: mediaVersion }));
    dispatch({ type: MEDIA_CREATE_RESET });
  };

  return (
    <>
      <Offcanvas show={show} onHide={closeUIHandler} placement='end'>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            {parent ? 'Upload New Version' : 'Upload Video'}
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {parent
            ? `Upload new version of "${parent.mediaName}" from computer, after process successful update media details.`
            : 'Upload video file from computer, after process successful update media details.'}
          {parent && <hr />}
          {parent && <h6 className='text-secondary'>Parent:</h6>}
          {parent && <h6 className='text-light'>{parent.mediaName}</h6>}
          {parent && <h6 className='text-secondary'>Latest version:</h6>}
          {parent && (
            <h6 className='text-light'>
              {parent.child ? parent.child[0].version : parent.version}
            </h6>
          )}
          <Row
            className='justify-content-md-center'
            style={{ paddingTop: '10vh' }}
          >
            <Col md={10}>
              {(uploading || mediaLoading) && (
                <>
                  <h6 className='text-center loading'>{progressMessage}</h6>
                  <ProgressBar animated now={progress} />
                </>
              )}
              {mediaUpdateLoading && <Loader />}
              {mediaError && <Message>{mediaError}</Message>}
              {mediaUpdateError && <Message>{mediaUpdateError}</Message>}
              {successMessage && (
                <Message variant='success'>
                  {'Video successfully uploaded.'}
                </Message>
              )}
              <Form>
                <Form.Group controlId='formFile' className='mb-3' hidden>
                  <Form.Label></Form.Label>
                  <Form.Control
                    type='file'
                    ref={filePick}
                    onChange={uploadFileHandler}
                  />
                </Form.Group>
                {showButton && (
                  <Button
                    variant='outline-success'
                    style={{ width: '100%' }}
                    onClick={() => filePick.current.click()}
                  >
                    <span className='material-icons-round'>computer</span>
                    <span className='material-icons-round'>
                      arrow_right_alt
                    </span>
                    <span className='material-icons-round'>cloud_upload</span>
                    <h6>{parent ? 'Upload New Version' : 'Upload Video'}</h6>
                  </Button>
                )}
                {showUpdate && (
                  <>
                    <Form.Group className='mb-3' controlId='formGroupName'>
                      <Form.Label>Media Name</Form.Label>
                      <Form.Control
                        type='text'
                        placeholder='Enter media name'
                        value={mediaName}
                        onChange={(e) => setMediaName(e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group className='mb-3' controlId='formGroupVersion'>
                      <Form.Label>Version</Form.Label>
                      <Form.Control
                        type='number'
                        placeholder='Enter version'
                        value={mediaVersion}
                        onChange={(e) => setMediaVersion(e.target.value)}
                      />
                    </Form.Group>
                    <div className='text-center'>
                      <Button
                        style={{ width: '49%' }}
                        onClick={mediaUpdateHandler}
                      >
                        Update
                      </Button>{' '}
                      <Button
                        style={{ width: '49%' }}
                        variant='danger'
                        onClick={closeUIHandler}
                      >
                        Cancel
                      </Button>
                    </div>
                  </>
                )}
              </Form>
            </Col>
          </Row>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default VideoUpload;
