import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render, wait } from '@testing-library/react';
import 'i18n/__mocks__/i18nMock';
import portalUserMock from 'components/__mocks__/portalUserMocks';
import PortalUserForm from 'components/PortalUserForm';
import { createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';

const theme = createMuiTheme();

describe('PortalUser Form', () => {
  it('shows form', () => {
    const { getByLabelText } = render(
      <ThemeProvider theme={theme}>
        <PortalUserForm portalUser={portalUserMock} />
      </ThemeProvider>
    );
    expect(getByLabelText('entities.portalUser.username').value).toBe(
      'Maiores possimus ut et voluptatem cupiditate quod est molestias. Et vel qui non quibusdam occaecati sapiente voluptas. Non quam consequatur aperiam ipsa suscipit quod ratione eum error. Consequuntur voluptas eum et quaerat et.'
    );
  });

  it('submits form', async () => {
    const handleSubmit = jest.fn();
    const { getByTestId } = render(
      <ThemeProvider theme={theme}>
        <PortalUserForm portalUser={portalUserMock} onSubmit={handleSubmit} />
      </ThemeProvider>
    );

    const form = getByTestId('portalUser-form');
    fireEvent.submit(form);

    await wait(() => {
      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });
  });
});
