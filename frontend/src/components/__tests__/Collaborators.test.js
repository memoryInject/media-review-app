import { screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { useSelector } from 'react-redux';

import { testRender, makeTestStore } from '../../reduxTestUtils';
import Collaborators from '../Collaborators';
import {
  USER_DETAILS_SUCCESS,
  USER_LOGIN_SUCCESS,
} from '../../constants/userConstants';
import { MEDIA_DETAILS_SUCCESS } from '../../constants/mediaConstants';
import { PLAYLIST_DETAILS_SUCCESS } from '../../constants/playlistConstants';
import { REVIEW_DETAILS_SUCCESS } from '../../constants/reviewConstants';
import {
  COLLABORATOR_LIST_SUCCESS,
  COLLABORATOR_UI_SHOW,
} from '../../constants/collaboratorConstants';

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
  id: 2,
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

const userB = {
  id: 3,
  username: 'testerB',
  email: 'testerB@example.com',
  firstName: '',
  lastName: '',
  profile: {
    companyName: '',
    isAdmin: false,
    imageUrl: 'https://memoryinject.io/img/profile.jpg',
  },
};

let review = {
  id: 1,
  imageUrl: 'https://memoryinject.io/img/review.jpg',
  reviewName: 'Test Review 1',
  description: 'Test Description',
  project: { id: 1, projectName: 'Test Project' },
  isOpen: true,
  numberOfMedia: 2,
  numberOfCollaborator: 4,
  user: admin,
  collaborators: [user, admin],
  media: [],
};

const server = setupServer(
  rest.post('/api/v1/auth/invite/', (req, res, ctx) => {
    return res(ctx.json({}));
  }),

  rest.patch('/api/v1/review/reviews/:id/', (req, res, ctx) => {
    return res(ctx.json({ ...review, collaborators: req.body.collaborators }));
  }),

  rest.get('/api/v1/review/reviews/:id/', (req, res, ctx) => {
    return res(ctx.json({ ...review }));
  }),

  rest.get('/api/v1/auth/users/', (req, res, ctx) => {
    return res(ctx.json([user, admin, userB]));
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
  await store.dispatch({
    type: REVIEW_DETAILS_SUCCESS,
    payload: review,
  });
  await store.dispatch({
    type: COLLABORATOR_LIST_SUCCESS,
    payload: review,
  });
  await store.dispatch({
    type: COLLABORATOR_UI_SHOW,
  });

  testRender(
    <>
      <DisplayState />
      <Collaborators location={location} history={history} match={match} />
    </>,

    {
      store,
    }
  );
});

test('show review collaborators user images', async () => {
  expect(screen.getAllByRole('img')).toHaveLength(2);
});

test('show review collaborator details', async () => {
  expect(screen.getAllByRole('img')).toHaveLength(2);
  let profile = screen.getAllByRole('img')[0]
  fireEvent.click(profile)
  await waitFor(()=>screen.findByText('Email'))
});

test('non creator can not see add collaborator button', async () => {
  expect(screen.queryByText('Add Collaborator')).toBeFalsy();
});

test('creator can see add collaborator button', async () => {
  await store.dispatch({
    type: USER_DETAILS_SUCCESS,
    payload: admin,
  });
  await waitFor(() => screen.findByText('Add Collaborator'));
});

test('creator can delete a collaborator from the review', async () => {
  await store.dispatch({
    type: USER_DETAILS_SUCCESS,
    payload: admin,
  });
  let profile = screen.getAllByRole('img')[0]
  fireEvent.click(profile)
  await waitFor(()=>screen.findByText('Email'))

  fireEvent.click(screen.getByText('Remove'))

  fireEvent.click(screen.getByText('Understood'));
  await waitFor(()=>screen.findByText('Successfully removed collaborator.'))
});

test('creator can add existing user as collaborator', async () => {
  await store.dispatch({
    type: USER_DETAILS_SUCCESS,
    payload: admin,
  });

  await waitFor(() => screen.findByText('Add Collaborator'));
  fireEvent.click(screen.getByText('Add Collaborator'));

  await waitFor(() => screen.findByText('Add existing user'));
  fireEvent.click(screen.getByText('Add existing user'));

  await waitFor(() => screen.findByText('testerB'));
  let checkBox = screen.getByTestId('user-add-checkbox0');
  expect(checkBox.checked).toBeFalsy();
  fireEvent.click(checkBox);
  expect(checkBox.checked).toBeTruthy();

  fireEvent.click(screen.getByText('Add selected users'));
  await waitFor(() => screen.findByText('Successfully added users.'));
});

test('creator can send email invitation', async () => {
  await store.dispatch({
    type: USER_DETAILS_SUCCESS,
    payload: admin,
  });

  await waitFor(() => screen.findByText('Add Collaborator'));
  fireEvent.click(screen.getByText('Add Collaborator'));

  await waitFor(() => screen.findByText('Send invitation'));
  fireEvent.click(screen.getByText('Send invitation'));

  await waitFor(() => screen.findByPlaceholderText('Enter email'));
  fireEvent.change(screen.getByPlaceholderText('Enter email'), {
    target: { value: 'newTester@example.com' },
  });
  fireEvent.click(screen.getByTestId('send-invitation-btn'));
  await waitFor(() => screen.findByText('Successfully send email.'));
  //await waitFor(() => screen.debug());
});
