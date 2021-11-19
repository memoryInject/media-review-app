import { screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { useSelector } from 'react-redux';

import { testRender, makeTestStore } from '../../reduxTestUtils';
import AppSettingsScreen from '../AppSettingsScreen';
import {
  USER_DETAILS_SUCCESS,
  USER_LOGIN_SUCCESS,
} from '../../constants/userConstants';

// Display state for global toast message
function DisplayState() {
  const toastDetails = useSelector((state) => state.toastDetails);
  const { message } = toastDetails;

  return (
    <div>
      <h2>Display State</h2>
      {message && (
        <>
          <h1>{message}</h1>
        </>
      )}
    </div>
  );
}

let store;

const location = {};
const history = { push: function () {} };
const match = { params: { id: 1 } };

let user = {
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

let admin = {
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

let projects = {
  count: 2,
  next: null,
  previous: null,
  results: [
    {
      id: 1,
      projectName: 'Test1',
      imageUrl: null,
      color: '#FFFFFF',
      user: admin,
    },
    {
      id: 2,
      projectName: 'Test2',
      imageUrl: null,
      color: '#FFFFFF',
      user: admin,
    },
  ],
};

const server = setupServer(
  rest.patch('/api/v1/auth/user/', (req, res, ctx) => {
    user = {
      ...user,
      profile: { ...user.profile, companyName: req.body.profile.companyName },
    };

    return res(ctx.json(user));
  }),

  rest.get('/api/v1/auth/user/', (req, res, ctx) => {
    return res(ctx.json(user));
  }),

  rest.post('/api/v1/auth/password/reset/', (req, res, ctx) => {
    return res(ctx.json({}));
  }),

  rest.get('/api/v1/review/projects/', (req, res, ctx) => {
    return res(ctx.json(projects));
  }),

  rest.get('/api/v1/auth/users/', (req, res, ctx) => {
    return res(ctx.json([user, admin]));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

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
    <>
      <DisplayState />
      <AppSettingsScreen location={location} history={history} match={match} />
    </>,
    {
      store,
    }
  );
});

test('Show user info', async () => {
  expect(screen.getByText('tester@example.com')).toBeInTheDocument();
});

test('Logged in user can edit their profile', async () => {
  fireEvent.click(screen.getByText('Edit profile'));
  await waitFor(() => screen.findByText('Submit'));
  fireEvent.change(screen.getByPlaceholderText('Enter company name'), {
    target: { value: 'Testing company' },
  });
  fireEvent.click(screen.getByText('Submit'));
  await waitFor(() => screen.findByText('Testing company'));
});

test('Logged in user can request reset password', async () => {
  fireEvent.click(screen.getByText('Change password'));
  await waitFor(() => screen.findByText('Submit'));
  let emailField = screen.getByPlaceholderText('Enter email');
  expect(emailField.value).toEqual(user.email);

  fireEvent.click(screen.getByText('Submit'));
  await waitFor(() =>
    screen.findByText('Password reset email send successfully')
  );
});

test('show project list', async () => {
  fireEvent.click(screen.getByText('Project List'));
  await waitFor(() => screen.findByText('Test1'));
  await waitFor(() => screen.findByText('Test2'));
})

test('show user list for admin', async () => {
  await store.dispatch({
    type: USER_DETAILS_SUCCESS,
    payload: admin,
  });
  fireEvent.click(screen.getByText('User List'));

  await waitFor(() => screen.findByText('tester'));
  await waitFor(() => screen.findByText('testerAdmin'));
  //await waitFor(() => screen.debug());
})


