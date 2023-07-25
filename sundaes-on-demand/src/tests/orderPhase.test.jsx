import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from '../App';

test('order phases for happy path', async () => {
  const user = userEvent.setup();

  // render app
  const { unmount } = render(<App />);

  // add ice cream scoops and toppings
  const vanillaInput = await screen.findByRole('spinbutton', {
    name: 'Vanilla'
  });
  await user.clear(vanillaInput);
  await user.type(vanillaInput, '1');

  const cherriesCheckbox = await screen.findByRole('checkbox', {
    name: 'Cherries'
  });
  await user.click(cherriesCheckbox);

  // find and click order button
  const orderButton = screen.getByRole('button', { name: /order sundae/i });
  await user.click(orderButton);

  // check summary information based on order
  const scoopsTotal = screen.getByText(/scoops:/i);
  const toppingsTotal = screen.getByText(/toppings:/i);

  expect(scoopsTotal).toHaveTextContent('2.0');
  expect(toppingsTotal).toHaveTextContent('1.5');

  // accept terms and conditions and click button to confirm order
  const termsCheckbox = screen.getByRole('checkbox', {
    name: /Terms and Conditions/i
  });
  await user.click(termsCheckbox);
  expect(termsCheckbox).toBeChecked();

  const confirmButton = screen.getByRole('button', { name: /Confirm order/i });
  await user.click(confirmButton);

  // confirm order number on confirmation page
  const orderNumber = await screen.findByText(/Your order number is/i);
  expect(orderNumber).toHaveTextContent('77');

  // click "new order" button on confirmation page
  const newOrderButton = screen.getByRole('button', {
    name: /Create new order/i
  });
  await user.click(newOrderButton);

  // check that scoops and toppings subtotals have been reset
  const scoopsSubtotal = screen.getByText(/Scoops total: \$/i);
  const toppingsSubtotal = screen.getByText(/Toppings total: \$/i);

  expect(scoopsSubtotal).toHaveTextContent('0.00');
  expect(toppingsSubtotal).toHaveTextContent('0.00');

  unmount();
});
