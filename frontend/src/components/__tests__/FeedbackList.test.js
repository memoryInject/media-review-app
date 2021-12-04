import { screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import { testRender, makeTestStore } from '../../reduxTestUtils';
import FeedbackList from '../FeedbackList';
import {
  USER_DETAILS_SUCCESS,
  USER_LOGIN_SUCCESS,
} from '../../constants/userConstants';
import { MEDIA_DETAILS_SUCCESS } from '../../constants/mediaConstants';
import { REVIEW_DETAILS_SUCCESS } from '../../constants/reviewConstants';
import { FEEDBACK_LIST_SUCCESS } from '../../constants/feedbackConstants';

let store;

const location = {};
const history = { push: function () {} };
const match = { params: { id: 1 } };

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
  user: {},
  review: { id: 1 },
  parent: null,
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
  collaborators: [user, admin],
  media: {},
};

let feedbacks = [
  {
    id: 1,
    content: 'This is a test feedback',
    mediaTime: 3.14,
    annotationUrl: null,
    user,
    media: {...media, review: 1},
    parent: null,
  },
  {
    id: 2,
    content: 'This is a test feedback 2',
    mediaTime: 3.14,
    annotationUrl: null,
    user: admin,
    media: {...media, review: 1},
    parent: null,
  },
];

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
    type: FEEDBACK_LIST_SUCCESS,
    payload: feedbacks,
  });
  await store.dispatch({
    type: MEDIA_DETAILS_SUCCESS,
    payload: media,
  });

  testRender(
    <FeedbackList location={location} history={history} match={match} />,
    {
      store,
    }
  );
});

test('show feedback list', async () => {
  //screen.debug();
  // Need to wait here because there is a delay state in FeedbackList componet
  // which use timeout.
  await waitFor(()=>screen.findByText(feedbacks[0].content))
  expect(screen.getByText(feedbacks[0].content)).toBeInTheDocument();
  expect(screen.getByText(feedbacks[1].content)).toBeInTheDocument();
});

test('Logged in user can see edit and delete button for user written feedback', async () => {
  await waitFor(()=>screen.findByText(feedbacks[0].content))
  expect(screen.queryAllByText('edit_note')).toHaveLength(1);
  expect(screen.queryAllByText('delete_forever')).toHaveLength(1);
});

test('Logged in user can see reply button for feedbacks', async () => {
  await waitFor(()=>screen.findByText(feedbacks[0].content))
  expect(screen.queryAllByText('REPLY')).toHaveLength(2);
});

test('Logged in user can click delete button and show the delete confirm modal', async () => {
  await waitFor(()=>screen.findByText(feedbacks[0].content))
  fireEvent.click(screen.getByText('delete_forever'));
  await waitFor(() =>
    screen.getByText(/This will delete the feedback forever!/)
  );
});
