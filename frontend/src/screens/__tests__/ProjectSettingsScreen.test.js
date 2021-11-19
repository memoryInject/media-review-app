import { screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { useSelector } from 'react-redux';

import { testRender, makeTestStore } from '../../reduxTestUtils';
import ProjectSettingsScreen from '../ProjectSettingsScreen';
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

let project = {
  id: 1,
  projectName: 'Test1',
  imageUrl: null,
  color: '#FFFFFF',
  user: admin,
  reviews: [],
};

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
      user: admin,
      collaborators: [],
      media: [],
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
      user: admin,
      collaborators: [],
      media: [],
    },
  ],
};

const server = setupServer(
  rest.get('/api/v1/review/projects/:id/', (req, res, ctx) => {
    return res(ctx.json(project));
  }),

  rest.patch('/api/v1/review/projects/:id/', (req, res, ctx) => {
    project = { ...project, projectName: req.body.projectName };
    return res(ctx.json(project));
  }),

  rest.delete('/api/v1/review/projects/:id/', (req, res, ctx) => {
    return res(ctx.json({}));
  }),

  rest.get('/api/v1/review/reviews/', (req, res, ctx) => {
    return res(ctx.json(reviews));
  }),

  rest.delete('/api/v1/review/reviews/:id', (req, res, ctx) => {
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

  testRender(
    <>
      <DisplayState />
      <ProjectSettingsScreen
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

test('Show project info', async () => {
  await waitFor(() => screen.findByText(admin.username));
  await waitFor(() => screen.findAllByText(project.projectName));
});

test('Project creator can edit the project', async () => {
  await store.dispatch({
    type: USER_DETAILS_SUCCESS,
    payload: admin,
  });
  await waitFor(() => screen.findByText(admin.username));
  let editBtn = screen.getByText('Edit');
  expect(editBtn).toBeInTheDocument();
  fireEvent.click(editBtn);
  await waitFor(() => screen.findByText('Submit'));

  let updatedName = 'Updated project';
  fireEvent.change(screen.getByPlaceholderText('Enter project name'), {
    target: { value: updatedName },
  });

  fireEvent.click(screen.getByText('Submit'));
  await waitFor(() => screen.findAllByText(updatedName));
  expect(screen.getByText('Project updated successfully')).toBeInTheDocument();
});

test('Project creator can delete the project', async () => {
  await store.dispatch({
    type: USER_DETAILS_SUCCESS,
    payload: admin,
  });
  await waitFor(() => screen.findByText(admin.username));
  let deleteBtn = screen.getByText('Delete');
  expect(deleteBtn).toBeInTheDocument();
  fireEvent.click(deleteBtn);
  await waitFor(() =>
    screen.findByText('This will delete the project forever!')
  );

  let confirmBtn = screen.getByText('Understood')
  expect(confirmBtn).toBeInTheDocument();
  fireEvent.click(confirmBtn);

  await waitFor(() => screen.findByText('Project deleted successfully'));
});

test('show review list', async () => {
  fireEvent.click(screen.getByText('Review List'))
  await waitFor(() => screen.findByText(reviews.results[0].reviewName));
  expect(screen.getByText(reviews.results[0].reviewName)).toBeInTheDocument()
  expect(screen.getByText(reviews.results[1].reviewName)).toBeInTheDocument()
})

test('review creator can see delete button in review list', async () => {
  await store.dispatch({
    type: USER_DETAILS_SUCCESS,
    payload: admin,
  });
  fireEvent.click(screen.getByText('Review List'))
  await waitFor(() => screen.findByText(reviews.results[0].reviewName));
  expect(screen.getAllByText('delete')).toBeTruthy();
})

test('review creator can delete review from review list', async () => {
  await store.dispatch({
    type: USER_DETAILS_SUCCESS,
    payload: admin,
  });
  fireEvent.click(screen.getByText('Review List'))
  await waitFor(() => screen.findByText(reviews.results[0].reviewName));
  
  let deleteReview = screen.getAllByText('delete')[0]
  expect(deleteReview).toBeInTheDocument();
  fireEvent.click(deleteReview)
  await waitFor(() =>
    screen.findByText('This will delete the review forever!')
  );

  let confirmBtn = screen.getByText('Understood')
  expect(confirmBtn).toBeInTheDocument();
  fireEvent.click(confirmBtn);

  await waitFor(() => screen.findByText('Review deleted successfully'));
  //await waitFor(() => screen.debug());
})
