import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render, wait } from '@testing-library/react';
import 'i18n/__mocks__/i18nMock';
import ticketingSystemMock from 'components/__mocks__/ticketingSystemMocks';
import TicketingSystemForm from 'components/TicketingSystemForm';
import { createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';

const theme = createMuiTheme();

describe('TicketingSystem Form', () => {
  it('shows form', () => {
    const { getByLabelText } = render(
      <ThemeProvider theme={theme}>
        <TicketingSystemForm ticketingSystem={ticketingSystemMock} />
      </ThemeProvider>
    );
    expect(getByLabelText('entities.ticketingSystem.url').value).toBe(
      'Nesciunt exercitationem tenetur et doloremque. Et et deserunt libero ex assumenda suscipit. Aut consequuntur vel hic impedit deserunt aspernatur. Exercitationem sint fugit fugiat id cumque dolor dicta hic.'
    );
  });

  it('submits form', async () => {
    const handleSubmit = jest.fn();
    const { getByTestId } = render(
      <ThemeProvider theme={theme}>
        <TicketingSystemForm ticketingSystem={ticketingSystemMock} onSubmit={handleSubmit} />
      </ThemeProvider>
    );

    const form = getByTestId('ticketingSystem-form');
    fireEvent.submit(form);

    await wait(() => {
      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });
  });
});
