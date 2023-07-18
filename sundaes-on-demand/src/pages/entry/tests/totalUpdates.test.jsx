import { render, screen } from '../../../test-utils/testing-library-utils';
import userEvent from '@testing-library/user-event';
import Options from '../Options';
import OrderEntry from '../OrderEntry';

test('Update scoop subtotal when scoops change', async () => {
  const user = userEvent.setup();
  render(<Options optionType="scoops" />);

  // make sure total starts out $0.00
  const scoopsSubtotal = screen.getByText('Scoops total: $', { exact: false });
  expect(scoopsSubtotal).toHaveTextContent('0.00');

  // update vanilla scoops to 1 and check the subtotal
  const vanillaInput = await screen.findByRole('spinbutton', {
    name: 'Vanilla'
  });
  await user.clear(vanillaInput);
  await user.type(vanillaInput, '1');
  expect(scoopsSubtotal).toHaveTextContent('2.00');

  // update chocolate scoops to 2 and check subtotal
  const chocolateInput = await screen.findByRole('spinbutton', {
    name: 'Chocolate'
  });
  await user.clear(chocolateInput);
  await user.type(chocolateInput, '2');
  expect(scoopsSubtotal).toHaveTextContent('6.00');
});

test('Update topping subtotal when toppings change', async () => {
  const user = userEvent.setup();
  render(<Options optionType="toppings" />);

  // make sure total starts out $0.00
  const toppingsSubtotal = screen.getByText('Toppings total: $', {
    exact: false
  });
  expect(toppingsSubtotal).toHaveTextContent('0.00');

  // tick cherries topping and check subtotal
  const cherriesCheckbox = await screen.findByRole('checkbox', {
    name: 'Cherries'
  });
  await user.click(cherriesCheckbox);
  expect(toppingsSubtotal).toHaveTextContent('1.50');

  // tick M&Ms topping and check subtotal
  const mmsCheckbox = await screen.findByRole('checkbox', {
    name: 'M&Ms'
  });
  await user.click(mmsCheckbox);
  expect(toppingsSubtotal).toHaveTextContent('3.00');

  // tick cherrie topping off and check subtotal
  await user.click(cherriesCheckbox);
  expect(toppingsSubtotal).toHaveTextContent('1.50');
});

describe.only('grand total', () => {
  test.only('grand total starts at $0.00', () => {
    const { unmount } = render(<OrderEntry />);

    const grandtotal = screen.getByRole('heading', {
      name: /grand total: \$/i
    });
    expect(grandtotal).toHaveTextContent('0.00');

    unmount();
  });

  test('grand total updates properly if scoop is added first', async () => {
    const user = userEvent.setup();
    render(<OrderEntry />);

    const grandtotal = screen.getByRole('heading', {
      name: /grand total: \$/i
    });

    // add scoop
    const vanillaInput = await screen.findByRole('spinbutton', {
      name: 'Vanilla'
    });
    await user.clear(vanillaInput);
    await user.type(vanillaInput, '1');

    // add topping
    const cherriesCheckbox = await screen.findByRole('checkbox', {
      name: 'Cherries'
    });
    await user.click(cherriesCheckbox);

    // check grandtotal
    expect(grandtotal).toHaveTextContent('3.50');
  });

  test('grand total updates properly if topping is added first', async () => {
    const user = userEvent.setup();
    render(<OrderEntry />);

    const grandtotal = screen.getByRole('heading', {
      name: /grand total: \$/i
    });

    // add topping
    const mmsCheckbox = await screen.findByRole('checkbox', {
      name: 'M&Ms'
    });
    await user.click(mmsCheckbox);

    // add scoop
    const chocolateInput = await screen.findByRole('spinbutton', {
      name: 'Chocolate'
    });
    await user.clear(chocolateInput);
    await user.type(chocolateInput, '2');

    // check grandtotal
    expect(grandtotal).toHaveTextContent('5.50');
  });

  test('grand total updates properly if item is removed', async () => {
    const user = userEvent.setup();
    render(<OrderEntry />);

    const grandtotal = screen.getByRole('heading', {
      name: /grand total: \$/i
    });

    // add topping
    const mmsCheckbox = await screen.findByRole('checkbox', {
      name: 'M&Ms'
    });
    await user.click(mmsCheckbox);

    // check grandtotal
    expect(grandtotal).toHaveTextContent('1.50');

    // remove topping
    await user.click(mmsCheckbox);

    // check grandtotal
    expect(grandtotal).toHaveTextContent('0.00');
  });
});
