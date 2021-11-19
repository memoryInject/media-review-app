import { screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { useSelector } from 'react-redux';

import { testRender, makeTestStore } from '../../reduxTestUtils';
import VideoUpload from '../VideoUpload';
import {
  USER_DETAILS_SUCCESS,
  USER_LOGIN_SUCCESS,
} from '../../constants/userConstants';
import {
  MEDIA_CREATE_SHOW,
  MEDIA_CREATE_SUCCESS,
} from '../../constants/mediaConstants';
import { REVIEW_DETAILS_SUCCESS } from '../../constants/reviewConstants';

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
  username: 'tester2',
  email: 'tester2@example.com',
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

let media = {
  id: 1,
  mediaName: 'Test Media',
  version: 1,
  mediaType: 'video',
  asset: {
    id: 1,
    assetName: 'Test Asset',
    url: 'https://memoryinject.io/videos/test.mp4',
    width: 1920,
    height: 1080,
    assetFormat: 'mp4',
    duration: 5.16,
    frameRate: 25,
    resourceType: 'video',
    imageUrl: 'https://memoryinject.io/videos/test.jpg',
  },
  user: admin,
  review: review,
  parent: null,
};

const server = setupServer(
  rest.get('/api/v1/review/media/', (req, res, ctx) => {
    return res(ctx.json([media]));
  }),

  rest.patch('/api/v1/review/media/:id/', (req, res, ctx) => {
    let updateMedia = {
      ...media,
      mediaName: req.body.mediaName,
      version: req.body.version,
    };
    return res(ctx.json(updateMedia));
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
    type: MEDIA_CREATE_SHOW,
    payload: review,
  });

  testRender(
    <>
      <DisplayState />
      <VideoUpload location={location} history={history} match={match} />
    </>,
    {
      store,
    }
  );
});

test('show video upload button', async () => {
  expect(screen.getAllByText('cloud_upload')).toBeTruthy();
});

test('non collaborators gets message', async () => {
  await store.dispatch({
    type: USER_DETAILS_SUCCESS,
    payload: userB,
  });

  await waitFor(() => screen.findByText('User is not a collaborator'));
});

test('After media created success, show success message', async () => {
  await store.dispatch({
    type: MEDIA_CREATE_SUCCESS,
    payload: media,
  });

  await waitFor(() => screen.findByText('Video successfully uploaded.'));
});

test('After media created success, show update media form with media details', async () => {
  await store.dispatch({
    type: MEDIA_CREATE_SUCCESS,
    payload: media,
  });

  await waitFor(() => screen.findByText('Update'));
  expect(screen.getByDisplayValue('Test Media')).toBeInTheDocument();
});

test('After media created success, update media', async () => {
  await store.dispatch({
    type: MEDIA_CREATE_SUCCESS,
    payload: media,
  });

  await waitFor(() => screen.findByText('Update'));
  expect(screen.getByDisplayValue('Test Media')).toBeInTheDocument();
  fireEvent.change(screen.getByRole('textbox', { name: /Media Name/ }), {
    target: { value: 'Update Media' },
  });

  fireEvent.click(screen.getByText('Update'));

  await waitFor(() => screen.findByText('Media updated successfully'));
});
