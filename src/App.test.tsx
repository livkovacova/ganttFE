import React from 'react';
import { render, screen } from '@testing-library/react';
import GanttApp from './GanttApp';

test('renders learn react link', () => {
  render(<GanttApp />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
