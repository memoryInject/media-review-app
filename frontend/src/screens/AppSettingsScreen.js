import React, { useState, useEffect } from 'react';
import { Row, Col, Container, ListGroup, Button, Image } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import Loader from '../components/Loader';
import Message from '../components/Message';

import { getUserDetails } from '../actions/userActions';
import ProfileUpdateModal from '../components/ProfileUpdateModal';

const AppSettingsScreen = ({ history, match }) => {
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userDetails = useSelector((state) => state.userDetails);
  const { user } = userDetails;

  const [navItem, setNavItem] = useState('account');
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  useEffect(() => {
    if (!userInfo) {
      history.push('/login');
    }
  }, [history, userInfo, dispatch]);

  return (
    <div>
      <Row xs='auto'>
        <Col>
          <h5>
            <span
              style={{ position: 'relative', top: '5px' }}
              className='material-icons-round'
            >
              construction
            </span>
            &nbsp;
            <strong>App Settings</strong>
          </h5>
        </Col>
      </Row>
      <Row
        xs='auto'
        style={{ cursor: 'pointer', paddingBottom: '1rem' }}
        className='dflex justify-content-center text-success'
      >
        <Col className='py-1'>
          {navItem === 'account' ? (
            <span>
              <strong>Account</strong>
            </span>
          ) : (
            <span onClick={() => setNavItem('account')}>Account</span>
          )}
        </Col>
        <Col className='py-1'>
          {navItem === 'projectList' ? (
            <span>
              <strong>Project list</strong>
            </span>
          ) : (
            <span onClick={() => setNavItem('projectList')}>Project list</span>
          )}
        </Col>
        <Col className='py-1'>
          {navItem === 'userList' ? (
            <span>
              <strong>User list</strong>
            </span>
          ) : (
            <span onClick={() => setNavItem('userList')}>User list</span>
          )}
        </Col>
      </Row>
      <Container>
        <Row className='dflex justify-content-center'>
          {navItem === 'account' && (
            <Col
              xs={12}
              md={12}
              lg={6}
              className='bg-dark py-2'
              style={{ borderRadius: '0.25rem' }}
            >
              <div className='py-2 text-center'>
                <Image
                  src={user.profile.imageUrl}
                  roundedCircle
                  style={{
                    height: '42px',
                    cursor: 'pointer',
                  }}
                />
                &nbsp; &nbsp;
                <span className='text-light'>{user.username}</span>
              </div>

              <ListGroup as='ol'>
                <ListGroup.Item
                  as='li'
                  className='d-flex justify-content-between align-items-start'
                >
                  <div className='ms-2 me-auto'>
                    <div className='text-light'>Username</div>
                    <h5 className='px-2'>{user.username}</h5>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item
                  as='li'
                  className='d-flex justify-content-between align-items-start'
                >
                  <div className='ms-2 me-auto'>
                    <div className='text-light'>Email</div>
                    <h5 className='px-2'>{user.email}</h5>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item
                  as='li'
                  className='d-flex justify-content-between align-items-start'
                >
                  <div className='ms-2 me-auto'>
                    <div className='text-light'>First name</div>
                    <h5 className='px-2'>{user.firstName}</h5>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item
                  as='li'
                  className='d-flex justify-content-between align-items-start'
                >
                  <div className='ms-2 me-auto'>
                    <div className='text-light'>Last name</div>
                    <h5 className='px-2'>{user.lastName}</h5>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item
                  as='li'
                  className='d-flex justify-content-between align-items-start'
                >
                  <div className='ms-2 me-auto'>
                    <div className='text-light'>Company name</div>
                    <h5 className='px-2'>
                      {user.profile.companyName ? user.profile.companyName : ''}
                    </h5>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item
                  as='li'
                  className='d-flex justify-content-between align-items-start'
                >
                  <div className='ms-2 me-auto'>
                    <div className='text-light'>Admin access</div>
                    <h5 className='px-2'>
                      {user.profile.isAdmin ? (
                        <span className='material-icons-round text-success'>
                          check_box
                        </span>
                      ) : (
                        <span className='material-icons-round text-danger'>
                          disabled_by_default
                        </span>
                      )}
                    </h5>
                  </div>
                </ListGroup.Item>
              </ListGroup>
              <div className='py-3 text-end'>
                <Button>Change password</Button>
                &nbsp; &nbsp;
                <Button onClick={() => setShowUpdateModal(true)}>
                  Edit profile
                </Button>
              </div>
              {/*Form to update user profile */}
              {/*TODO*/}
              {/*<ProjectUpdateDeleteForm*/}
              {/*history={history}*/}
              {/*match={match}*/}
              {/*project={project}*/}
              {/*userDetails={userDetails}*/}
              {/*/>*/}
            </Col>
          )}
        </Row>
        <Row className='dflex justify-content-center'>
          {navItem === 'projectList' && (
            <Col
              xs='auto'
              className='bg-dark py-2'
              style={{ borderRadius: '0.25rem' }}
            >
              {/*Table to show project list of this project*/}
              {/*TODO*/}
              {/*<ProjectReviewListTable*/}
              {/*history={history}*/}
              {/*match={match}*/}
              {/*project={project}*/}
              {/*userDetails={userDetails}*/}
              {/*/>*/}
            </Col>
          )}
        </Row>
      </Container>
      <ProfileUpdateModal
        onHide={() => setShowUpdateModal(false)}
        show={showUpdateModal}
        user={user}
      />
    </div>
  );
};

export default AppSettingsScreen;
