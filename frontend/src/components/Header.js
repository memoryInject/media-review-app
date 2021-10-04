import React from 'react';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../actions/userActions';

const Header = () => {
  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.userDetails);
  const { user } = userDetails;

  const logoutHandler = () => {
    dispatch(logout());
  };

  return (
    <header>
      <Navbar bg='dark' variant='dark' expand='lg'>
        <Container>
          <LinkContainer to='/'>
            <Navbar.Brand>Media-Review</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          {user && (
            <Navbar.Collapse id='basic-navbar-nav'>
              <Nav className='me-auto'>
                <LinkContainer to='/'>
                  <Nav.Link>Projects</Nav.Link>
                </LinkContainer>
                <NavDropdown title='Dropdown' id='basic-nav-dropdown'>
                  <NavDropdown.Item href='#action/3.1'>Action</NavDropdown.Item>
                  <NavDropdown.Item href='#action/3.2'>
                    Another action
                  </NavDropdown.Item>
                  <NavDropdown.Item href='#action/3.3'>
                    Something
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href='#action/3.4'>
                    Separated link
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
              <Nav>
                <NavDropdown title={user.username} id='username'>
                  <LinkContainer to='/profile'>
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          )}
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
