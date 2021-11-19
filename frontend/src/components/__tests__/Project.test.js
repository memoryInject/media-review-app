import { screen, render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';

import Project from '../Project';

const project = {
  id: 1,
  color: '#FFFFF',
  imageUrl: 'https://memoryinject.io/img/project.jpg',
  projectName: 'Test Project',
};

test('project component to display project info card', () => {
  render(
    <Router>
      <Project project={project} />
    </Router>
  );
  //screen.debug();
  expect(screen.getByText(project.projectName)).toBeInTheDocument();
});
