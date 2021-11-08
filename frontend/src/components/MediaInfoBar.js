import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col, Dropdown } from 'react-bootstrap';

import { listMediaDetails } from '../actions/mediaActions';
import { listFeedbacks } from '../actions/feedbackActions';
import { FEEDBACK_CREATE_RESET } from '../constants/feedbackConstants';
import {
  MEDIA_CREATE_PARENT,
  MEDIA_CREATE_SHOW,
} from '../constants/mediaConstants';

const MediaInfoBar = () => {
  const dispatch = useDispatch();
  const mediaDetails = useSelector((state) => state.mediaDetails);
  const { media } = mediaDetails;

  const reviewDetails = useSelector((state) => state.reviewDetails);
  const { review } = reviewDetails;

  const playlistDetails = useSelector((state) => state.playlistDetails);
  const { playlist: playlistDetail } = playlistDetails;

  const userDetails = useSelector((state) => state.userDetails);
  const { user } = userDetails;

  const [versions, setVersions] = useState([]);

  useEffect(() => {
    if (media && playlistDetail) {
      if (media.parent) {
        let parent = playlistDetail.filter((p) => p.id === media.parent.id)[0];
        setVersions([...parent.child, parent]);
      } else {
        let playMedia = playlistDetail.filter((p) => p.id === media.id)[0];
        if (!playMedia.child) {
          setVersions([]);
        }
      }
    }
  }, [media, playlistDetail]);

  const mediaHandler = (media) => {
    dispatch(listMediaDetails(media.id));
    dispatch(listFeedbacks(media.id));
    dispatch({ type: FEEDBACK_CREATE_RESET });
  };

  const addVersionHandler = () => {
    if (media && playlistDetail) {
      if (media.parent) {
        let parent = playlistDetail.filter((p) => p.id === media.parent.id)[0];
        dispatch({ type: MEDIA_CREATE_PARENT, payload: parent });
      } else {
        let parent = playlistDetail.filter((p) => p.id === media.id)[0];
        dispatch({ type: MEDIA_CREATE_PARENT, payload: parent });
      }
      dispatch({ type: MEDIA_CREATE_SHOW });
    }
  };

  return (
    <>
      <div
        style={{
          borderRadius: '0.25rem',
          border: '1px solid #303030',
          marginBottom: '6px',
          marginTop: '10px',
          paddingLeft: '5px',
        }}
      >
        <Row xs='auto'>
          <>
            <Col>
              <span
                className='material-icons-round'
                style={{
                  fontSize: '34px',
                  transform: 'translate(-6px, 6px)',
                  color: '#375A7F',
                  marginBottom: '15px',
                }}
              >
                theaters
              </span>
            </Col>
            {review && media && (
              <>
                <Col>
                  <Row>
                    <h6
                      style={{
                        fontSize: '12px',
                        marginTop: '6px',
                        marginBottom: '2px',
                        paddingLeft: '0px',
                        paddingRight: '0px',
                        transform: 'translate(-10px, 0px)',
                        position: 'relative',
                      }}
                    >
                      <Link
                        to={`/projects/${review.project.id}`}
                        style={{ textDecoration: 'none' }}
                        className='fw-bold'
                      >
                        {review.project.projectName}
                      </Link>
                      <span
                        className='material-icons-round text-secondary'
                        style={{
                          position: 'absolute',
                          top: '-5px',
                        }}
                      >
                        arrow_right
                      </span>
                      <span
                        style={{ position: 'relative', left: '18px' }}
                        className='text-light'
                      >
                        &nbsp;&nbsp;{review.reviewName}
                      </span>
                    </h6>
                  </Row>
                  <Row>
                    <h6
                      style={{
                        paddingTop: '0px',
                        marginTop: '0px',
                        paddingLeft: '0px',
                        display: 'inline',
                        paddingRight: '0px',
                        transform: 'translate(-10px, 0px)',
                      }}
                    >
                      {media.mediaName}
                    </h6>
                  </Row>
                </Col>
                <Col>
                  <Dropdown className='my-2'>
                    <Dropdown.Toggle
                      variant='outline-success'
                      id='dropdown-basic'
                      size='sm'
                    >
                      Version {media.version}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      {versions &&
                        versions.map((v, idx) => (
                          <Dropdown.Item
                            key={idx}
                            onClick={() => mediaHandler(v)}
                          >
                            {String(v.version).padStart(4, '0')}
                          </Dropdown.Item>
                        ))}
                      <Dropdown.Divider />
                      {user && user.profile.isAdmin && (
                        <Dropdown.Item
                          eventKey='4'
                          onClick={() => addVersionHandler()}
                        >
                          <span
                            //style={{ transform: 'translate(0, 6px)' }}
                            className='material-icons-round'
                          >
                            library_add
                          </span>
                        </Dropdown.Item>
                      )}
                    </Dropdown.Menu>
                  </Dropdown>
                </Col>
              </>
            )}
          </>
        </Row>
      </div>
    </>
  );
};

export default MediaInfoBar;
