import { render, screen } from '@testing-library/react';
import Footer from '../Footer';

test('for check footer', () => {
  render(<Footer />);
  expect(screen.getByText(/Copyright © Media-Review-App/)).toBeInTheDocument();
});
