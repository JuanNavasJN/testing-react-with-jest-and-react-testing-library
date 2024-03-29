import {
  render,
  screen,
  waitFor
} from '../../../test-utils/testing-library-utils';
import OrderEntry from '../OrderEntry';
import { rest } from 'msw';
import { server } from '../../../mocks/server';

test('Handles error for scoops and toppings routes', async () => {
  server.resetHandlers(
    rest.get('http://localhost:3030/scoops', (req, res, ctx) => {
      res(ctx.status(500));
    }),
    rest.get('http://localhost:3030/toppings'),
    (req, res, ctx) => {
      res(ctx.status(500));
    }
  );

  render(<OrderEntry />);

  await waitFor(async () => {
    const alerts = await screen.findAllByRole('alert');
    // const alerts = await screen.findAllByText(
    //   /An unexpected error occurred. Please try again later./i
    // );

    expect(alerts).toHaveLength(2);
  });
});
