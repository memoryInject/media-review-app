import { screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { useSelector } from 'react-redux';

import { testRender, makeTestStore } from '../../reduxTestUtils';
import ReviewSettingsScreen from '../ReviewSettingsScreen';
import {
  USER_DETAILS_SUCCESS,
  USER_LOGIN_SUCCESS,
} from '../../constants/userConstants';
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
const match = { params: { id: 1, reviewId: 1 } };

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
  parent: 1,
};

let review = {
  id: 1,
  imageUrl: 'https://memoryinject.io/img/review.jpg',
  reviewName: 'Test Review 1',
  description: 'Test Description',
  project: { id: 1 },
  isOpen: true,
  numberOfMedia: 2,
  numberOfCollaborator: 4,
  user: admin,
  collaborators: [user, admin],
  media: [mediaA, mediaB],
};

const server = setupServer(
  rest.get('/api/v1/review/reviews/:id/', (req, res, ctx) => {
    return res(ctx.json(review));
  }),

  rest.patch('/api/v1/review/reviews/:id/', (req, res, ctx) => {
    review = { ...review, reviewName: req.body.reviewName };
    return res(ctx.json(review));
  }),

  rest.delete('/api/v1/review/reviews/:id/', (req, res, ctx) => {
    return res(ctx.json({}));
  }),

  rest.get('/api/v1/review/media/', (req, res, ctx) => {
    return res(ctx.json([mediaA, mediaB]));
  }),

  rest.get('/api/v1/review/media/:id/', (req, res, ctx) => {
    return res(ctx.json(mediaA));
  }),

  rest.patch('/api/v1/review/media/:id/', (req, res, ctx) => {
    mediaA = { ...mediaA, mediaName: req.body.mediaName };
    return res(ctx.json(mediaA));
  }),

  rest.delete('/api/v1/review/media/:id/', (req, res, ctx) => {
    return res(ctx.json({}));
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
    <>
      <DisplayState />
      <ReviewSettingsScreen
        location={location}
        history={history}
        match={match}
      />
    </>,
    {
      store,
    }
  );
});

test('Show review info', async () => {
  await waitFor(() => screen.findByText(admin.username));
  await waitFor(() => screen.findAllByText(review.reviewName));
});

test('Review creator can edit the review', async () => {
  await store.dispatch({
    type: USER_DETAILS_SUCCESS,
    payload: admin,
  });
  await waitFor(() => screen.findByText(admin.username));
  let editBtn = screen.getByText('Edit');
  expect(editBtn).toBeInTheDocument();
  fireEvent.click(editBtn);
  await waitFor(() => screen.findByText('Submit'));

  let updatedName = 'Updated review';
  fireEvent.change(screen.getByPlaceholderText('Enter review name'), {
    target: { value: updatedName },
  });

  fireEvent.click(screen.getByText('Submit'));
  await waitFor(() => screen.findAllByText(updatedName));
  expect(screen.getByText('Review updated successfully')).toBeInTheDocument();
});

test('Review creator can delete the review', async () => {
  await store.dispatch({
    type: USER_DETAILS_SUCCESS,
    payload: admin,
  });
  await waitFor(() => screen.findByText(admin.username));
  let deleteBtn = screen.getByText('Delete');
  expect(deleteBtn).toBeInTheDocument();
  fireEvent.click(deleteBtn);
  await waitFor(() =>
    screen.findByText('This will delete the review forever!')
  );

  let confirmBtn = screen.getByText('Understood');
  expect(confirmBtn).toBeInTheDocument();
  fireEvent.click(confirmBtn);

  await waitFor(() => screen.findByText('Review deleted successfully'));
});

test('show media list', async () => {
  fireEvent.click(screen.getByText('Media List'));
  await waitFor(() => screen.findByText(mediaA.mediaName));
  expect(screen.getByText(mediaA.mediaName)).toBeInTheDocument();
  expect(screen.getByText(mediaB.mediaName)).toBeInTheDocument();
});

test('media creator can see edit and delete button in media list', async () => {
  await store.dispatch({
    type: USER_DETAILS_SUCCESS,
    payload: admin,
  });
  fireEvent.click(screen.getByText('Media List'));
  await waitFor(() => screen.findByText(mediaA.mediaName));
  expect(screen.getAllByText('delete')).toBeTruthy();
  expect(screen.getAllByText('edit')).toBeTruthy();
});

test('media creator can delete media from media list', async () => {
  await store.dispatch({
    type: USER_DETAILS_SUCCESS,
    payload: admin,
  });
  fireEvent.click(screen.getByText('Media List'));
  await waitFor(() => screen.findByText(mediaA.mediaName));

  let deleteReview = screen.getAllByText('delete')[0];
  expect(deleteReview).toBeInTheDocument();
  fireEvent.click(deleteReview);
  await waitFor(() => screen.findByText('This will delete the media forever!'));

  let confirmBtn = screen.getByText('Understood');
  expect(confirmBtn).toBeInTheDocument();
  fireEvent.click(confirmBtn);

  await waitFor(() => screen.findByText('Media deleted successfully'));
});

test('media creator can edit media from media list', async () => {
  await store.dispatch({
    type: USER_DETAILS_SUCCESS,
    payload: admin,
  });
  fireEvent.click(screen.getByText('Media List'));
  await waitFor(() => screen.findByText(mediaA.mediaName));

  let editMedia = screen.getAllByText('edit')[0];
  expect(editMedia).toBeInTheDocument();
  fireEvent.click(editMedia);
  await waitFor(() => screen.findByText('Submit'));

  let updatedName = 'Updated media';
  fireEvent.change(screen.getByPlaceholderText('Enter media name'), {
    target: { value: updatedName },
  });

  fireEvent.click(screen.getByText('Submit'));
  await waitFor(() => screen.findAllByText('Media updated successfully'));
  expect(screen.getByText('Media updated successfully')).toBeInTheDocument();
  //await waitFor(() => screen.debug());
});
