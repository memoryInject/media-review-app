import { screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { useSelector } from 'react-redux';

import { testRender, makeTestStore } from '../../reduxTestUtils';
import ReviewScreen from '../ReviewScreen';
import {
  USER_DETAILS_SUCCESS,
  USER_LOGIN_SUCCESS,
} from '../../constants/userConstants';
import { MEDIA_DETAILS_SUCCESS } from '../../constants/mediaConstants';
import { PLAYLIST_DETAILS_SUCCESS } from '../../constants/playlistConstants';
import { REVIEW_DETAILS_SUCCESS } from '../../constants/reviewConstants';

// We have to mock this component because this componet uses react-player
// and react-konva npm packages, both of this packages gives errors while
// testing with jest and react-testing-library.
jest.mock('../../components/ReactPlayerComp', () => () => {
  return (
    <div>
      <h1>ReactPlayerComp</h1>
    </div>
  );
});

//jest.mock('../../components/FeedbackList', () => () => {
  //return (
    //<div>
      //<h1>FeedbackList</h1>
    //</div>
  //);
//});

// Mock captureAudio because jest does not have MediaRecorder
jest.mock('../../utils/captureAudio', () => {
  return {
    setBlobHandler: () =>{},
    setErrorHandler: () => {},
    startRecording: () => {},
    stopRecording: () => {},
  }
});

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
const match = { params: { id: 1, reviewId: 1 } };

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

const adminB = {
  id: 3,
  username: 'testerAdminB',
  email: 'tester@example.com',
  firstName: '',
  lastName: '',
  profile: {
    companyName: '',
    isAdmin: true,
    imageUrl: 'https://memoryinject.io/img/profile.jpg',
  },
};

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
  user: admin,
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
  review: { id: 1 },
  parent: { ...mediaA },
};

let playlist = [{ ...mediaA, child: [{ ...mediaB }] }, mediaB];

let feedbacks = [
  {
    id: 1,
    content: 'This is a test feedback',
    mediaTime: 3.14,
    annotationUrl: null,
    user,
    mediaB: {...mediaB, review: 1},
    parent: null,
  },
  {
    id: 2,
    content: 'This is a test feedback 2',
    mediaTime: 3.14,
    annotationUrl: null,
    user: admin,
    mediaB: {...mediaB, review: 1},
    parent: null,
  },
];

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
  media: [mediaA],
};

const server = setupServer(
  rest.get('/api/v1/review/media/', (req, res, ctx) => {
    return res(ctx.json([mediaA, mediaB]));
  }),

  rest.get('/api/v1/review/media/:id/', (req, res, ctx) => {
    let mediaSent = parseInt(req.params.id) === 1 ? mediaA : mediaB;
    return res(ctx.json(mediaSent));
  }),

  rest.get('/api/v1/review/reviews/:id/', (req, res, ctx) => {
    return res(ctx.json(review));
  }),

  rest.get('/api/v1/review/feedbacks/', (req, res, ctx) => {
    return res(ctx.json(feedbacks));
  }),

  rest.post('/api/v1/review/feedbacks/', (req, res, ctx) => {
    let newFeedback = {
      id: 3,
      content: req.body.content,
      mediaTime: 3.14,
      annotationUrl: null,
      user,
      mediaB,
      parent: null,
    };
    feedbacks = [...feedbacks, newFeedback];
    return res(ctx.json(newFeedback));
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
    type: MEDIA_DETAILS_SUCCESS,
    payload: mediaB,
  });
  await store.dispatch({
    type: PLAYLIST_DETAILS_SUCCESS,
    payload: { playlist, review: { id: review.id } },
  });

  testRender(
    <>
      <DisplayState />
      <ReviewScreen location={location} history={history} match={match} />
    </>,
    {
      store,
    }
  );
});

test('review screen show expected components', async () => {
  expect(screen.getByText('ReactPlayerComp')).toBeInTheDocument();

  // Feedback list
  expect(screen.getByText('Feedback')).toBeInTheDocument();

  // MediaInfoBar
  await waitFor(() => screen.findByText('Test Media 2'));

  // Playlist show 2 versions of the media
  expect(screen.getByText('filter_2')).toBeInTheDocument();

  // ReviewButtons
  expect(screen.getByText('settings')).toBeInTheDocument();
});

test('Non collaborated admin can not upload video', async () => {
  await store.dispatch({
    type: USER_DETAILS_SUCCESS,
    payload: adminB,
  });

  let upload = screen.getByText('Upload');
  expect(upload).toBeInTheDocument();
  fireEvent.click(upload);
  await waitFor(() => screen.findByText('User is not a collaborator'));
});

test('Non collaborated admin can not post feedback', async () => {
  await store.dispatch({
    type: USER_DETAILS_SUCCESS,
    payload: adminB,
  });
  expect(screen.queryByText('POST')).toBeFalsy();
});

test('Collaborator can write feedback to review', async () => {
  await waitFor(() => screen.findByText('This is a test feedback'));
  fireEvent.change(screen.getByPlaceholderText('Write feedback...'), {
    target: { value: 'New feedback' },
  });
  fireEvent.click(screen.getByText('POST'));
  await waitFor(() => screen.findByText('New feedback'));
});
