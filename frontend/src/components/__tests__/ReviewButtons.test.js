import { screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import { testRender, makeTestStore } from '../../reduxTestUtils';
import ReviewButtons from '../ReviewButtons';
import {
  USER_DETAILS_SUCCESS,
  USER_LOGIN_SUCCESS,
} from '../../constants/userConstants';

let store;

const location = {};
const history = { push: function () {}, location: {pathname: '/review'} };
const match = { params: { id: 1 } };

const user = {
  id: 1,
  username: 'tester',
  email: 'tester@example.com',
  firstName: '',
  lastName: '',
  profile: {
    companyName: '',
    isAdmin: false,
    imageUrl: 'https://memoryinject.io/img/profile.jpg',
  },
};

const admin = {
  id: 1,
  username: 'testerAdmin',
  email: 'tester@example.com',
  firstName: '',
  lastName: '',
  profile: {
    companyName: '',
    isAdmin: true,
    imageUrl: 'https://memoryinject.io/img/profile.jpg',
  },
};

beforeEach(async () => {
  store = makeTestStore();

  await store.dispatch({
    type: USER_LOGIN_SUCCESS,
    payload: { key: 'testkey1234' },
  });
  await store.dispatch({
    type: USER_DETAILS_SUCCESS,
    payload: user,
  });

  testRender(
    <ReviewButtons location={location} history={history} match={match} />,
    {
      store,
    }
  );
});

test('user can see Collaborators and settings icons', async () => {
  expect(screen.getByText('people')).toBeInTheDocument();
  expect(screen.getByText('settings')).toBeInTheDocument();
});

test('normal user can not see video upload icon', async () => {
  expect(screen.queryByText('cloud_upload')).toBeFalsy();
});

test('admin user can see video upload icon', async () => {
  await store.dispatch({
    type: USER_DETAILS_SUCCESS,
    payload: admin,
  });

  expect(screen.queryByText('cloud_upload')).toBeTruthy();
});

