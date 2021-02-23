import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render, wait } from '@testing-library/react';
import 'i18n/__mocks__/i18nMock';
import ticketMock from 'components/__mocks__/ticketMocks';
import TicketForm from 'components/TicketForm';
import { createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';

const theme = createMuiTheme();

describe('Ticket Form', () => {
  it('shows form', () => {
    const { getByLabelText } = render(
      <ThemeProvider theme={theme}>
        <TicketForm ticket={ticketMock} />
      </ThemeProvider>
    );
    expect(getByLabelText('entities.ticket.systemId').value).toBe(
      'Sapiente aut architecto. Quo et et aut commodi et qui. Sint est ut.'
    );
  });

  it('submits form', async () => {
    const handleSubmit = jest.fn();
    const { getByTestId } = render(
      <ThemeProvider theme={theme}>
        <TicketForm ticket={ticketMock} onSubmit={handleSubmit} />
      </ThemeProvider>
    );

    const form = getByTestId('ticket-form');
    fireEvent.submit(form);

    await wait(() => {
      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });
  });
});
