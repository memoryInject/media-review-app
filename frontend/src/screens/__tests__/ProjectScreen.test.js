import { screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import { testRender, makeTestStore } from '../../reduxTestUtils';
import ProjectScreen from '../ProjectScreen';
import {
  USER_DETAILS_SUCCESS,
  USER_LOGIN_SUCCESS,
} from '../../constants/userConstants';

let store;

const location = {};
const history = { push: function () {} };
const match = { params: { id: 1 } };

let project = { id: 1, projectName: 'Test1', imageUrl: null, color: '#FFFFFF' };

let reviews = {
  count: 2,
  next: null,
  previous: null,
  results: [
    {
      id: 1,
      imageUrl: 'https://memoryinject.io/img/review.jpg',
      reviewName: 'Test Review 1',
      description: 'Test Description',
      project: { id: 1 },
      isOpen: true,
      numberOfMedia: 2,
      numberOfCollaborator: 4,
      user: {},
      collaborators: {},
      media: {},
    },
    {
      id: 2,
      imageUrl: 'https://memoryinject.io/img/review.jpg',
      reviewName: 'Test Review 2',
      description: 'Test Description',
      project: { id: 1 },
      isOpen: true,
      numberOfMedia: 2,
      numberOfCollaborator: 4,
      user: {},
      collaborators: {},
      media: {},
    },
  ],
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

const server = setupServer(
  rest.get('/api/v1/review/projects/:id/', (req, res, ctx) => {
    return res(ctx.json(project));
  }),

  rest.get('/api/v1/review/reviews/', (req, res, ctx) => {
    return res(ctx.json(reviews));
  }),

  rest.post('/api/v1/review/reviews/', (req, res, ctx) => {
    let review = {
      id: 3,
      imageUrl: 'https://memoryinject.io/img/review.jpg',
      reviewName: req.body.reviewName,
      description: req.body.description,
      project: { id: 1 },
      isOpen: true,
      numberOfMedia: 2,
      numberOfCollaborator: 4,
      user: {},
      collaborators: {},
      media: {},
    };

    reviews = { ...reviews, results: [review, ...reviews.results] };
    return res(ctx.json(reviews));
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
    <ProjectScreen location={location} history={history} match={match} />,
    {
      store,
    }
  );
});

describe('Show list of reviews and create a review', () => {
  it('Check reviews shows', async () => {
    await waitFor(() => screen.findByText(reviews.results[0].reviewName));
    //screen.debug()
    //console.log(store.getState())
    expect(screen.getByText(reviews.results[0].reviewName)).toBeInTheDocument();
    expect(screen.getByText(reviews.results[1].reviewName)).toBeInTheDocument();
  });

  it('normal user do not see create project button', async () => {
    await waitFor(() => screen.findByText(reviews.results[0].reviewName));
    expect(screen.queryAllByText('CREATE REVIEW')).toHaveLength(0);
  });

  it('admin user see create review button and click it', async () => {
    store.dispatch({
      type: USER_DETAILS_SUCCESS,
      payload: admin,
    });

    await waitFor(() => screen.findByText(reviews.results[0].reviewName));
    expect(screen.queryAllByText('CREATE REVIEW')).toBeTruthy();

    fireEvent.click(screen.getAllByText('CREATE REVIEW')[0]);
    await waitFor(() => screen.findByText('Submit'));
  });

  it('admin user can create review', async () => {
    store.dispatch({
      type: USER_DETAILS_SUCCESS,
      payload: admin,
    });
    await waitFor(() => screen.findByText(reviews.results[0].reviewName));
    fireEvent.click(screen.getAllByText('CREATE REVIEW')[0]);
    await waitFor(() => screen.findByText('Submit'));

    fireEvent.change(screen.getByRole('textbox', { name: /Name/ }), {
      target: { value: 'New Review' },
    });

    fireEvent.change(screen.getByPlaceholderText('Enter review description'), {
      target: { value: 'New Description' },
    });

    fireEvent.click(screen.getByText('Submit'));

    // After submit new review wait for the review list to update
    await waitFor(() => screen.findByText('New Review'));
  });
});
