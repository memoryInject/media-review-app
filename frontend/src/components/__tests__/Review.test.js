import { screen, render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';

import Review from '../Review';

const review = {
  id: 1,
  imageUrl: 'https://memoryinject.io/img/review.jpg',
  reviewName: 'Test Review',
  description: 'Test Description',
  project: {id: 1},
  isOpen: true,
  numberOfMedia: 2,
  numberOfCollaborator: 4,
  user: {},
  collaborators: {},
  media: {},
};

test('review component to display review info card', () => {
  render(
    <Router>
      <Review projectId={1} review={review} />
    </Router>
  );
  //screen.debug();
  expect(screen.getByText(review.reviewName)).toBeInTheDocument();
});
