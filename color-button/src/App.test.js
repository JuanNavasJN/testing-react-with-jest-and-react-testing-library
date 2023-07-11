import { render, screen, fireEvent } from '@testing-library/react';
// import { logRoles } from '@testing-library/react';
import { replaceCamelWithSpaces } from './App';

import App from './App';

test('button has correct initial color', () => {
  render(<App />);

  // const { container } = render(<App />);
  // logRoles(container);

  // find an elemnt with a role of button and text of 'Change to MidnightBlue'
  const colorButton = screen.getByRole('button', {
    name: 'Change to MidnightBlue'
  });

  // expect the background color to be MediumVioletRed
  expect(colorButton).toHaveStyle({ 'background-color': 'MediumVioletRed' });
});

test('button turns MidnightBlue when clicked', () => {
  render(<App />);
  const colorButton = screen.getByRole('button', {
    name: 'Change to MidnightBlue'
  });

  // click button
  fireEvent.click(colorButton);

  // expect the background color to be MidnightBlue
  expect(colorButton).toHaveStyle({ 'background-color': 'MidnightBlue' });

  // expect the button text to be 'Change to MediumVioletRed'
  expect(colorButton).toHaveTextContent('Change to MediumVioletRed');
});

test('initial conditions', () => {
  render(<App />);

  // check that the button starts out enabled
  const colorButton = screen.getByRole('button', {
    name: 'Change to MidnightBlue'
  });
  expect(colorButton).toBeEnabled();

  // check that the checkbox starts out unchecked
  const checkbox = screen.getByRole('checkbox');
  expect(checkbox).not.toBeChecked();
});

test('checkbox disables button on first click and enbles on second click', () => {
  render(<App />);

  const colorButton = screen.getByRole('button', {
    name: 'Change to MidnightBlue'
  });
  const checkbox = screen.getByRole('checkbox', { name: 'Disable button' });

  // click checkbox
  fireEvent.click(checkbox);

  // expect the button to be disabled
  expect(colorButton).toBeDisabled();

  // click checkbox again
  fireEvent.click(checkbox);

  // expect the button to be enabled
  expect(colorButton).toBeEnabled();
});

test('button should be disabled and gray when checkbox is checked', () => {
  render(<App />);
  const colorButton = screen.getByRole('button', {
    name: 'Change to MidnightBlue'
  });
  const checkbox = screen.getByRole('checkbox', { name: 'Disable button' });

  //-- flow 1: disable button -> button is gray -> enable button -> button is MediumVioletRed
  // click checkbox to disable button
  fireEvent.click(checkbox);

  // expect button background-color to be gray
  expect(colorButton).toHaveStyle({ 'background-color': 'gray' });

  // click checkbox to enable button
  fireEvent.click(checkbox);

  // expect button background-color to be MediumVioletRed
  expect(colorButton).toHaveStyle({ 'background-color': 'MediumVioletRed' });

  //-- flow 2: click button to change color (to MidnightBlue) -> disable button -> button is gray
  // click button to change color
  fireEvent.click(colorButton);

  // click checkbox to disable button
  fireEvent.click(checkbox);

  // expect button background-color to be gray
  expect(colorButton).toHaveStyle({ 'background-color': 'gray' });

  //-- flow 3: enable button -> button is MidnightBlue
  // click checkbox to enable button
  fireEvent.click(checkbox);

  // expect button background-color to be MidnightBlue
  expect(colorButton).toHaveStyle({ 'background-color': 'MidnightBlue' });
});

describe('spaces before camel-case capital letters', () => {
  test('Works for no inner capital letters', () => {
    expect(replaceCamelWithSpaces('Red')).toBe('Red');
  });

  test('Works for one inner capital letter', () => {
    expect(replaceCamelWithSpaces('MidnightBlue')).toBe('Midnight Blue');
  });

  test('Works for multiple inner capital letters', () => {
    expect(replaceCamelWithSpaces('MediumVioletRed')).toBe('Medium Violet Red');
  });
});
