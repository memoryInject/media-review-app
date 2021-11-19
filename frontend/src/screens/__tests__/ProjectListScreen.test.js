import { screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import { testRender, makeTestStore } from '../../reduxTestUtils';
import ProjectListScreen from '../ProjectListScreen';

import {
  USER_DETAILS_SUCCESS,
  USER_LOGIN_SUCCESS,
} from '../../constants/userConstants';

let store;

const location = {};
const history = { push: function () {} };
let projects = {
  count: 2,
  next: null,
  previous: null,
  results: [
    { id: 1, projectName: 'Test1', imageUrl: null, color: '#FFFFFF' },
    { id: 2, projectName: 'Test2', imageUrl: null, color: '#FFFFFF' },
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
  rest.get('/api/v1/review/projects/', (req, res, ctx) => {
    return res(ctx.json(projects));
  }),

  rest.post('/api/v1/review/projects/', (req, res, ctx) => {
    let project = {
      id: 3,
      projectName: req.body.projectName,
      imageUrl: null,
      color: '#FFFFFF',
    };

    projects = { ...projects, results: [project, ...projects.results] };
    return res(ctx.json(project));
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

  testRender(<ProjectListScreen location={location} history={history} />, {
    store,
  });
});

describe('Show list of project and create a project', () => {
  it('Check projects shows', async () => {
    await waitFor(() => screen.findByText(projects.results[0].projectName));
    //screen.debug()
    //console.log(store.getState())
    expect(
      screen.getByText(projects.results[0].projectName)
    ).toBeInTheDocument();
    expect(
      screen.getByText(projects.results[1].projectName)
    ).toBeInTheDocument();
  });

  it('normal user do not see create project button', async () => {
    await waitFor(() => screen.findByText(projects.results[0].projectName));
    expect(screen.queryAllByText('CREATE PROJECT')).toHaveLength(0);

    //screen.debug()
    //await waitFor(()=>console.log(store.getState()))
    //console.log(store.getState())
    //console.log(store.getState())
    //screen.debug(screen.queryAllByText('CREATE PROJECT'))
    //expect(screen.queryAllByText('CREATE PROJECT')).toHaveLength(0);
  });

  it('admin user see create project button and click it', async () => {
    store.dispatch({
      type: USER_DETAILS_SUCCESS,
      payload: admin,
    });

    await waitFor(() => screen.findByText(projects.results[0].projectName));
    expect(screen.queryAllByText('CREATE PROJECT')).toBeTruthy();

    fireEvent.click(screen.getAllByText('CREATE PROJECT')[0]);
    await waitFor(() => screen.findByText('Submit'));
  });

  it('admin user can create project', async () => {
    store.dispatch({
      type: USER_DETAILS_SUCCESS,
      payload: admin,
    });
    await waitFor(() => screen.findByText(projects.results[0].projectName));
    fireEvent.click(screen.getAllByText('CREATE PROJECT')[0]);
    await waitFor(() => screen.findByText('Submit'));

    fireEvent.change(screen.getByRole('textbox', { name: /Name/ }), {
      target: { value: 'New Project' },
    });

    fireEvent.click(screen.getByText('Submit'));

    // After submit new project wait for the projects list to update
    await waitFor(() => screen.findByText('New Project'));
  });
});
