import { screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import { testRender, makeTestStore } from '../../reduxTestUtils';
import Playlist from '../Playlist';
import {
  USER_DETAILS_SUCCESS,
  USER_LOGIN_SUCCESS,
} from '../../constants/userConstants';
import { REVIEW_DETAILS_SUCCESS } from '../../constants/reviewConstants';

let store;

const location = {};
const history = { push: function () {} };
const match = { params: { id: 1 } };

let mediaA = {
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
  user: {},
  review: { id: 1 },
  parent: null,
};

let mediaB = {
  id: 2,
  mediaName: 'Test Media 2',
  version: 2,
  mediaType: 'video',
  asset: {
    id: 1,
    assetName: 'Test Asset',
    url: 'https://memoryinject.io/videos/test2.mp4',
    width: 1920,
    height: 1080,
    assetFormat: 'mp4',
    duration: 5.16,
    frameRate: 25,
    resourceType: 'video',
    imageUrl: 'https://memoryinject.io/videos/test2.jpg',
  },
  user: {},
  review: { id: 1 },
  parent: { ...mediaA },
};

let mediaC = {
  id: 3,
  mediaName: 'Test Media 2',
  version: 2,
  mediaType: 'video',
  asset: {
    id: 1,
    assetName: 'Test Asset',
    url: 'https://memoryinject.io/videos/test3.mp4',
    width: 1920,
    height: 1080,
    assetFormat: 'mp4',
    duration: 5.16,
    frameRate: 25,
    resourceType: 'video',
    imageUrl: 'https://memoryinject.io/videos/test3.jpg',
  },
  user: {},
  review: { id: 1 },
  parent: null,
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
  user: {},
  collaborators: {},
  media: {},
};

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

const server = setupServer(
  rest.get('/api/v1/review/media/', (req, res, ctx) => {
    return res(ctx.json([mediaA, mediaB, mediaC]));
  }),

  rest.get('/api/v1/review/media/:id/', (req, res, ctx) => {
    let mediaSent = parseInt(req.params.id) === 1 ? mediaA : mediaB;
    return res(ctx.json(mediaSent));
  }),

  rest.get('/api/v1/review/feedbacks/', (req, res, ctx) => {
    return res(ctx.json([]));
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

  testRender(
    <Playlist location={location} history={history} match={match} />,
    {
      store,
    }
  );
});

test('show playlist', async () => {
  await waitFor(()=>screen.getAllByRole('img'))
  expect(screen.getAllByRole('img')).toHaveLength(2)
});

test('show versions info', async () => {
  await waitFor(()=>screen.getAllByRole('img'))
  expect(screen.getByText('filter_2')).toBeInTheDocument()
});
