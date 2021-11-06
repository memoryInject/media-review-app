import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Container,
  Button,
  Image,
  ButtonGroup,
  ToggleButton,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import ProfileUpdateModal from '../components/ProfileUpdateModal';
import PasswordResetEmailModal from '../components/PasswordResetEmailModal';
import UserProfileListGroup from '../components/UserProfileListGroup';
import ProjectListTable from '../components/ProjectListTable';
import UserListTable from '../components/UserListTable';

const AppSettingsScreen = ({ history, match }) => {
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userDetails = useSelector((state) => state.userDetails);
  const { user } = userDetails;

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showPasswordResetModal, setShowPasswordResetModal] = useState(false);
  const [radioValue, setRadioValue] = useState('1');

  const radios = [
    { name: 'Account', value: '1' },
    { name: 'Project List', value: '2' },
    { name: 'User List', value: '3' },
  ];

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
        style={{ paddingBottom: '1rem', paddingTop: '1rem' }}
        className='dflex justify-content-center'
      >
        <Col>
          <ButtonGroup>
            {radios.map((radio, idx) => (
              <ToggleButton
                key={idx}
                id={`radio-${idx}`}
                type='radio'
                variant='outline-success'
                name='radio'
                value={radio.value}
                checked={radioValue === radio.value}
                onChange={(e) => setRadioValue(e.currentTarget.value)}
                disabled={
                  radio.value === '3' && !user.profile.isAdmin ? true : false
                }
              >
                {radio.name}
              </ToggleButton>
            ))}
          </ButtonGroup>
        </Col>
      </Row>
      <Container>
        <Row className='dflex justify-content-center'>
          {radioValue === '1' && (
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

              {/*List group for user details*/}
              <UserProfileListGroup user={user} />

              <div className='py-3 text-end'>
                <Button onClick={() => setShowPasswordResetModal(true)}>
                  Change password
                </Button>
                &nbsp; &nbsp;
                <Button onClick={() => setShowUpdateModal(true)}>
                  Edit profile
                </Button>
              </div>
            </Col>
          )}
        </Row>
        <Row className='dflex justify-content-center'>
          {radioValue === '2' && (
            <Col
              xs='auto'
              className='bg-dark py-2'
              style={{ borderRadius: '0.25rem' }}
            >
              {/*Table to show project */}
              <ProjectListTable history={history} />
            </Col>
          )}
        </Row>
        <Row className='dflex justify-content-center'>
          {radioValue === '3' && (
            <Col
              xs='auto'
              className='bg-dark py-2'
              style={{ borderRadius: '0.25rem' }}
            >
              {/*Table to show users */}
              <UserListTable />
            </Col>
          )}
        </Row>
      </Container>

      {/*Modal Form to edit user profile*/}
      <ProfileUpdateModal
        onHide={() => setShowUpdateModal(false)}
        show={showUpdateModal}
        user={user}
      />

      {/*Modal Form to send reset email link*/}
      <PasswordResetEmailModal
        onHide={() => setShowPasswordResetModal(false)}
        show={showPasswordResetModal}
        user={user}
      />
    </div>
  );
};

export default AppSettingsScreen;
