import React, { useState, useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import {
  Offcanvas,
  Card,
  Row,
  Col,
  Spinner,
  Image,
  Button,
  Badge,
} from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';

import { showToast, messageToast, variantToast } from '../actions/toastActions';

import {
  deleteNotifications,
  listNotification,
} from '../actions/notificationActions';
import {
  NOTIFICATION_LIST_RESET,
  NOTIFICATION_ADD,
  NOTIFICATION_LIST_CLEAR,
  NOTIFICATION_NEW_COUNT_RESET,
  NOTIFICATION_DELETE,
  NOTIFICATIONS_CHECKED,
} from '../constants/notificationConstants';

import EventStream from '../utils/eventStream';

const Notifications = ({ placement, show, onHide }) => {
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const notificationList = useSelector((state) => state.notificationList);
  const { notifications, loading, success, error } = notificationList;

  const [fetchNotifications, setFetchNotifications] = useState(true);
  const [streamData, setStreamData] = useState(null);
  const [streamError, setStreamError] = useState(null);
  const [streamLog, setStreamLog] = useState(null);
  const [streamOn, setStreamOn] = useState(true);
  const [opened, setOpened] = useState(false);

  EventStream.setLogHandler(setStreamLog);
  EventStream.setDataHandler(setStreamData);
  EventStream.setErrorHandler(setStreamError);

  useEffect(() => {
    if (streamOn && userInfo && userInfo.key) {
      // Replace this url on production by removing host name
      let url = `http://127.0.0.1:8000/events/notifications/?token=${userInfo.key}`;
      //let url = `/events/notifications/?token=${userInfo.key}`;
      EventStream.startStream(url);
      setStreamOn(false);
    }
  }, [userInfo, streamOn]);

  useEffect(() => {
    if (streamData && streamData.group && streamData.group === 'notification') {
      dispatch({ type: NOTIFICATION_ADD, payload: streamData });
    }
  }, [streamData, dispatch]);

  // Fetch notifications from databse/old
  useEffect(() => {
    if (fetchNotifications) {
      dispatch(listNotification());
    }
  }, [dispatch, fetchNotifications, error, success]);

  // Run this after success
  useEffect(() => {
    if (success) {
      setFetchNotifications(false);
      dispatch(deleteNotifications());
    }
  }, [success, notifications, dispatch]);

  // Run this after error
  useEffect(() => {
    if (error) {
      dispatch(messageToast(error));
      dispatch(variantToast('danger'));
      dispatch(showToast(true));
    }
  }, [error, dispatch]);

  // Reset success after opening notifications
  useEffect(() => {
    if (show) {
      dispatch({ type: NOTIFICATION_LIST_RESET });
      dispatch({ type: NOTIFICATION_NEW_COUNT_RESET });
      setOpened(true);
    }
  }, [show, dispatch]);

  // Run this after open and closing the notificaion
  useEffect(() => {
    if (!show && opened) {
      dispatch({ type: NOTIFICATIONS_CHECKED });
      setOpened(false);
    }
  }, [show, opened, dispatch]);

  // Run this if an error occured during stream
  useEffect(() => {
    if (streamError) {
      console.log(streamError);
      dispatch(messageToast(streamError));
      dispatch(variantToast('danger'));
      dispatch(showToast(true));
    }
  }, [streamError, dispatch]);

  // Run this if a stream log occured
  useEffect(() => {
    if (streamLog) {
      console.log(streamLog);
    }
  }, [streamLog]);

  const clearHandler = () => dispatch({ type: NOTIFICATION_LIST_CLEAR });

  return (
    <Offcanvas show={show} placement={placement} onHide={onHide}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>
          <span
            className='material-icons-round'
            style={{ transform: 'translate(-5px, 6px)' }}
          >
            notifications
          </span>
          Notifiactions
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Row>
          <Col className='d-flex flex-row-reverse'>
            {loading && (
              <Spinner
                animation='grow'
                role='status'
                style={{
                  //margin: 'auto',
                  height: '20px',
                  width: '20px',
                  display: 'block',
                }}
                className='m-2 text-muted'
              >
                <span className='visually-hidden'>Loading...</span>
              </Spinner>
            )}
          </Col>
        </Row>
        <Row>
          <Col>
            <Button size='sm' onClick={clearHandler}>
              Clear All
            </Button>
          </Col>
        </Row>
        {notifications &&
          notifications.map((n, idx) => (
            <Card
              className='my-2'
              key={idx}
              style={{
                backgroundColor: '#444',
                animation: !n.checked && 'noti-color 5s',
              }}
            >
              <Row style={{ height: '2px' }}>
                <Col className='text-end'>
                  {!n.checked && (
                    <Badge bg='danger' className='mx-3'>
                      New
                    </Badge>
                  )}
                  <button
                    className='btn-clear'
                    style={{
                      transform: 'translate(-5px, 5px)',
                    }}
                    onClick={() =>
                      dispatch({ type: NOTIFICATION_DELETE, payload: n })
                    }
                  >
                    <span
                      className='material-icons-round noti-del'
                      style={{
                        fontSize: '20px',
                        color: '#888',
                      }}
                    >
                      close
                    </span>
                  </button>
                </Col>
              </Row>
              <Card.Body>
                <Row xs='auto'>
                  <Col className='align-self-center'>
                    {n.fromUser.imageUrl && (
                      <Image
                        alt='user profile picture'
                        src={n.fromUser.imageUrl}
                        roundedCircle
                        style={{
                          height: '32px',
                          position: 'relative',
                          top: '-5px',
                        }}
                      />
                    )}
                  </Col>
                  <Col className='px-0'>
                    <Card.Title className='h6 text-light'>
                      {n.fromUser.username}
                    </Card.Title>
                    <Card.Subtitle
                      className='text-success mb-2 fw-bold'
                      style={{
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        position: 'relative',
                        top: '-3px',
                      }}
                    >
                      {n.url && (
                        <>
                          <span
                            className='material-icons-round'
                            style={{
                              fontSize: '16px',
                              position: 'relative',
                              top: '5px',
                              marginRight: '2px',
                              marginLeft: '-1px',
                            }}
                          >
                            link
                          </span>
                          <LinkContainer to={n.url}>
                            <span>{n.msgType}</span>
                          </LinkContainer>
                        </>
                      )}
                    </Card.Subtitle>
                  </Col>
                </Row>
                <Card.Text>{n.message}</Card.Text>
              </Card.Body>
            </Card>
          ))}
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default Notifications;
