import React, { useState, useRef } from 'react';
import { Container, Nav, Navbar, NavDropdown, Image } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import About from './About';

import { logout } from '../actions/userActions';
import Notifications from './Notifications';

const Header = () => {
  const dispatch = useDispatch();
  let history = useHistory();

  const userDetails = useSelector((state) => state.userDetails);
  const { user } = userDetails;

  const notificationList = useSelector((state) => state.notificationList);
  const { newCount } = notificationList;

  const navdrop = useRef(null);
  const [modalShow, setModalShow] = useState(false);

  const [showNotifications, setShowNotifications] = useState(false);

  const handleCloseNotification = () => setShowNotifications(false);
  const handleShowNotification = () => setShowNotifications(true);

  const logoutHandler = () => {
    dispatch(logout());
    history.push('/login');
  };

  return (
    <header>
      <Navbar bg='dark' variant='dark' expand='lg' className='py-2'>
        <Container>
          <LinkContainer to='/'>
            <Navbar.Brand>
              <span
                className='material-icons-round'
                style={{ position: 'relative', top: '4px' }}
              >
                movie
              </span>
              <span className='d-none d-md-inline'> &nbsp; Media-Review</span>
            </Navbar.Brand>
          </LinkContainer>
          <div>
            <Navbar.Toggle aria-controls='basic-navbar-nav' />
            {newCount > 0 && (
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  position: 'absolute',
                  transform: 'translate(36px, -36px)',
                  borderRadius: '50%',
                }}
                className='d-block d-md-block d-lg-none bg-danger'
              ></div>
            )}
          </div>
          {user && (
            <Navbar.Collapse id='basic-navbar-nav'>
              <Nav className='me-auto'></Nav>
              <Nav>
                <div
                  onClick={handleShowNotification}
                  className='d-block d-md-block d-lg-none'
                >
                  <Nav.Link className='p-0'>
                    <span
                      className='material-icons-round'
                      style={{
                        fontSize: '30px',
                        padding: '0px',
                        marginBottom: '10px',
                        transform: 'translate(2px, 6px)',
                      }}
                    >
                      notifications
                    </span>
                    {newCount > 0 && (
                      <div
                        className='bg-danger text-center'
                        style={{
                          borderRadius: '50%',
                          height: '18px',
                          width: '18px',
                          display: 'inline-block',
                          position: 'absolute',
                          transform: 'translate(-13px, 10px)',
                        }}
                      >
                        <span
                          className='text-center fw-bold'
                          style={{
                            position: 'relative',
                            top: '-5px',
                            fontSize: '12px',
                          }}
                        >
                          {newCount}
                        </span>
                      </div>
                    )}
                    &nbsp; &nbsp;
                    <span>Notifications</span>
                  </Nav.Link>
                </div>
                <div
                  onClick={() => navdrop.current.children[0].click()}
                  style={{
                    cursor: 'pointer',
                    transform: 'translate(0px, 2px)',
                    zIndex: '223',
                  }}
                  className='d-block d-sm-block d-md-block d-lg-none'
                >
                  <Image
                    alt='user profile image'
                    src={user.profile.imageUrl}
                    roundedCircle
                    style={{
                      height: '32px',
                      cursor: 'pointer',
                    }}
                    className='nav-user-icon'
                  />
                  &nbsp; &nbsp;
                  {user.username}
                  <span
                    className='material-icons-round'
                    style={{
                      transform: 'translate(0px, 8px)',
                    }}
                  >
                    expand_more
                  </span>
                </div>
                <NavDropdown
                  className='nav-user-toggle'
                  id='username'
                  ref={navdrop}
                  style={{
                    transform: 'translate(0px, 0)',
                    zIndex: '222',
                    paddingRight: '0.2rem',
                  }}
                >
                  <LinkContainer to='/settings'>
                    <NavDropdown.Item>
                      <span
                        data-cy='header-settings'
                        className='material-icons-round'
                        style={{ transform: 'translate(-3px, 6px)' }}
                      >
                        settings
                      </span>
                      Settings
                    </NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler}>
                    <span
                      data-cy='header-logout'
                      className='material-icons-round'
                      style={{ transform: 'translate(-3px, 6px)' }}
                    >
                      logout
                    </span>
                    Logout
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={() => setModalShow(true)}>
                    <span
                      data-cy='header-about'
                      className='material-icons-round'
                      style={{ transform: 'translate(-3px, 6px)' }}
                    >
                      info
                    </span>
                    About
                  </NavDropdown.Item>
                </NavDropdown>
                <div
                  onClick={handleShowNotification}
                  className='px-3 d-none d-lg-block'
                >
                  <Nav.Link className='p-0'>
                    <span
                      className='material-icons-round'
                      style={{
                        fontSize: '30px',
                        padding: '0px',
                        margin: '0px',
                        transform: 'translate(0px, 7px)',
                        position: 'relative',
                      }}
                    >
                      notifications
                    </span>
                    {newCount > 0 && (
                      <div
                        className='bg-danger text-center'
                        style={{
                          borderRadius: '50%',
                          height: '18px',
                          width: '18px',
                          display: 'inline-block',
                          position: 'absolute',
                          transform: 'translate(-15px, 10px)',
                        }}
                      >
                        <span
                          className='text-center fw-bold'
                          style={{
                            position: 'relative',
                            top: '-5px',
                            fontSize: '12px',
                          }}
                        >
                          {newCount}
                        </span>
                      </div>
                    )}
                  </Nav.Link>
                </div>
                <div
                  data-cy='header-profile'
                  onClick={() => navdrop.current.children[0].click()}
                  style={{
                    cursor: 'pointer',
                    transform: 'translate(0px, 2px)',
                    zIndex: '223',
                    paddingLeft: '1.2rem',
                  }}
                  className='d-none d-sm-none d-lg-block'
                >
                  <Image
                    alt='user profile image'
                    src={user.profile.imageUrl}
                    roundedCircle
                    style={{
                      height: '38px',
                      cursor: 'pointer',
                    }}
                    className='nav-user-icon'
                  />
                </div>
              </Nav>
            </Navbar.Collapse>
          )}
        </Container>
      </Navbar>

      {/*About Modal for about this app*/}
      <About show={modalShow} onHide={() => setModalShow(false)} />

      {/*Notifiactions Offcanvas*/}
      <Notifications
        placement='end'
        show={showNotifications}
        onHide={handleCloseNotification}
      />
    </header>
  );
};

export default Header;
