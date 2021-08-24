import { render, screen } from '@testing-library/react';
import App from '../App';

// Mock component and screens
jest.mock('../components/Header', () => () => <div>Header</div>);
jest.mock('../components/Footer', () => () => <div>Footer</div>);

test('check componets and screens on App', () => {
  render(<App />);
  const Header = screen.getByText(/Header/);
  const Footer = screen.getByText(/Footer/);

  expect(Header).toBeInTheDocument();
  expect(Footer).toBeInTheDocument();
});
