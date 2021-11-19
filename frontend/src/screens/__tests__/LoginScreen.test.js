import { screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { useSelector } from 'react-redux';

import { testRender, makeTestStore } from '../../reduxTestUtils';
import LoginScreen from '../LoginScreen';

// Need this component in order to see the update state on screen
// because current LoginScreen does not show logged in user info.
function DisplayState() {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const userDetails = useSelector((state) => state.userDetails);
  const { user } = userDetails;

  return (
    <div>
      <h2>Display State</h2>
      {user && (
        <>
          <h1>{user.username}</h1>
          <h1>{user.email}</h1>
        </>
      )}
      {userInfo && <h1>{userInfo.key}</h1>}
    </div>
  );
}

let store;

const location = {};
const history = {
  push: function (url) {
    console.log('#mockHistory logged in success, push to', url);
  },
};

const keys = { admin: 'admintestkey1234', user: 'testertestkey1234' };

let users = [
  {
    username: 'tester',
    email: 'tester@example.com',
    firstName: '',
    lastName: '',
    profile: {
      companyName: '',
      imageUrl: 'https://memoryinject.io/img/profile.jpg',
      isAdmin: false,
    },
  },
  {
    username: 'testerAdmin',
    email: 'testerAdmin@example.com',
    firstName: '',
    lastName: '',
    profile: {
      companyName: '',
      imageUrl: 'https://memoryinject.io/img/profile.jpg',
      isAdmin: true,
    },
  },
];

const server = setupServer(
  rest.post('/api/v1/auth/login/', (req, res, ctx) => {
    let key = req.body.email === users[0].email ? keys.user : keys.admin;
    return res(ctx.json({ key }));
  }),

  rest.get('/api/v1/auth/user/', (req, res, ctx) => {
    let token = req.headers._headers.authorization.split(' ')[1];
    let user = token === keys.user ? users[0] : users[1];
    return res(ctx.json(user));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

beforeEach(() => {
  store = makeTestStore();
  testRender(
    <>
      <DisplayState />
      <LoginScreen location={location} history={history} />
    </>,
    { store }
  );
});

describe('fill form and submit', () => {
  it('when form is submitted, dispatch login and get back token and user form backend', async () => {
    fireEvent.change(screen.getByRole('textbox', { name: /Email/ }), {
      target: { value: users[0].email },
    });

    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'testpass123' },
    });

    fireEvent.click(screen.getByTestId('sign-in-btn'));

    // Wait for the state update for key
    await waitFor(() => screen.findByText(keys.user));

    // Wait for the state update for user details
    await waitFor(() => screen.findByText(users[0].email));
  });
});
