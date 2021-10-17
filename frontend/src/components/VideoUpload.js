import React, { useState, useRef, useEffect } from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import {
  Button,
  Form,
  Row,
  Col,
  ProgressBar,
  ToastContainer,
  Toast,
} from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';

import Loader from './Loader';
import Message from './Message';

import { createAsset } from '../actions/assetActions';
import { createMedia, updateMedia } from '../actions/mediaActions';
import { ASSET_CREATE_RESET } from '../constants/assetConstants';
import {
  MEDIA_CREATE_RESET,
  MEDIA_UPDATE_RESET,
} from '../constants/mediaConstants';

const VideoUpload = () => {
  const dispatch = useDispatch();

  const filePick = useRef(null);

  const [showUpload, setShowUpload] = useState(false);
  const [showButton, setShowButton] = useState(true);
  const [showUpdate, setShowUpdate] = useState(false);
  const [showToast, setShowToast] = useState(false);
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

  const reviewDetails = useSelector((state) => state.reviewDetails);
  const { review } = reviewDetails;

  const assetCreate = useSelector((state) => state.assetCreate);
  const { loading, error, asset } = assetCreate;

  const mediaCreate = useSelector((state) => state.mediaCreate);
  const { loading: mediaLoading, error: mediaError, media } = mediaCreate;

  const mediaUpdate = useSelector((state) => state.mediaUpdate);
  const {
    loading: mediaUpdateLoading,
    error: mediaUpdateError,
    media: mediaUpdated,
  } = mediaUpdate;

  // Reset all the state when open upload window
  useEffect(() => {
    if (showUpload) {
      setShowButton(true);
      setUploading(false);
      setShowUpdate(false);
      setSuccessMessage(false);
      setProgress(35);
      setProgressMessage('Uploading video it may take a while');
      setMediaName('');
      setMediaVersion(0);
      dispatch({ type: ASSET_CREATE_RESET });
      dispatch({ type: MEDIA_CREATE_RESET });
      dispatch({ type: MEDIA_UPDATE_RESET });
    }
  }, [showUpload, dispatch]);

  // This will create a new media after the asset creation
  useEffect(() => {
    if (asset) {
      dispatch(
        createMedia({
          mediaName: asset.assetName,
          asset: asset.id,
          review: review.id,
          mediaType: asset.resourceType,
        })
      );

      dispatch({ type: ASSET_CREATE_RESET });
      setProgress(85);
      setProgressMessage('Creating media');
    }
  }, [asset, dispatch, review]);

  useEffect(() => {
    if (media) {
      setMediaName(media.mediaName);
      setMediaVersion(media.version);
      setShowUpdate(true);
      setSuccessMessage(true);
    }
  }, [media]);

  useEffect(() => {
    if (mediaUpdated) {
      setShowUpload(false);
      setShowToast(true);
    }
  }, [mediaUpdated]);

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

        const asset = {
          assetName: data.originalFilename,
          url: data.url,
          height: data.height,
          width: data.width,
          assetFormat: data.format,
          duration: data.duration,
          frameRate: data.frameRate,
          resourceType: data.resourceType,
        };
        dispatch(createAsset(asset));
      }
      setUploading(false);
      setProgress(70);
      setProgressMessage('Creating asset');
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
      <Button
        variant='outline-success'
        style={{ minHeight: '6rem', width: '49%' }}
        onClick={() => setShowUpload(true)}
      >
        <span className='material-icons-round'>computer</span>
        <h6>Upload from computer</h6>
      </Button>{' '}
      <Offcanvas
        show={showUpload}
        onHide={() => setShowUpload(false)}
        placement='end'
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Upload Video</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          Upload video file from computer, after process successful update media
          details.
          <Row
            className='justify-content-md-center'
            style={{ paddingTop: '10vh' }}
          >
            <Col md={10}>
              {(uploading || loading || mediaLoading) && (
                <>
                  <h6 className='text-center loading'>{progressMessage}</h6>
                  <ProgressBar animated now={progress} />
                </>
              )}
              {mediaUpdateLoading && <Loader />}
              {error && <Message>{error}</Message>}
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
                    <h6>Upload Video</h6>
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
                        onClick={() => setShowUpload(false)}
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
      <ToastContainer position='top-end' className='p-3'>
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3000}
          autohide
          bg='success'
        >
          <Toast.Header>
            <span className='material-icons-round'>movie</span>
            <strong className='me-auto'>&nbsp;Media-Review</strong>
            <small className='text-muted'>just now</small>
          </Toast.Header>
          <Toast.Body>Media successfully updated.</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
};

export default VideoUpload;
