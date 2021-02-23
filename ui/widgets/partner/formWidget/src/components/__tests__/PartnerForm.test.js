import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render, wait } from '@testing-library/react';
import 'i18n/__mocks__/i18nMock';
import partnerMock from 'components/__mocks__/partnerMocks';
import PartnerForm from 'components/PartnerForm';
import { createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';

const theme = createMuiTheme();

describe('Partner Form', () => {
  it('shows form', () => {
    const { getByLabelText } = render(
      <ThemeProvider theme={theme}>
        <PartnerForm partner={partnerMock} />
      </ThemeProvider>
    );
    expect(getByLabelText('entities.partner.name').value).toBe(
      'Similique reprehenderit et dolor voluptatem et autem eum expedita. Sit laudantium rerum illo aperiam repudiandae excepturi non rerum. Delectus impedit rem qui consequuntur suscipit ab laborum. Odit est eveniet repudiandae quisquam.'
    );
  });

  it('submits form', async () => {
    const handleSubmit = jest.fn();
    const { getByTestId } = render(
      <ThemeProvider theme={theme}>
        <PartnerForm partner={partnerMock} onSubmit={handleSubmit} />
      </ThemeProvider>
    );

    const form = getByTestId('partner-form');
    fireEvent.submit(form);

    await wait(() => {
      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });
  });
});
