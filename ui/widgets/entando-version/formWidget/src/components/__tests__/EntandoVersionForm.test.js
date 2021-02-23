import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render, wait } from '@testing-library/react';
import 'i18n/__mocks__/i18nMock';
import entandoVersionMock from 'components/__mocks__/entandoVersionMocks';
import EntandoVersionForm from 'components/EntandoVersionForm';
import { createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';

const theme = createMuiTheme();

describe('EntandoVersion Form', () => {
  it('shows form', () => {
    const { getByLabelText } = render(
      <ThemeProvider theme={theme}>
        <EntandoVersionForm entandoVersion={entandoVersionMock} />
      </ThemeProvider>
    );
    expect(getByLabelText('entities.entandoVersion.name').value).toBe(
      'Dolorem tempora commodi aspernatur quo nesciunt debitis culpa et. Rerum sint ut est dolore excepturi reprehenderit. Quo nobis aut vero id molestiae. Natus porro dicta occaecati et consequatur in occaecati voluptate.'
    );
  });

  it('submits form', async () => {
    const handleSubmit = jest.fn();
    const { getByTestId } = render(
      <ThemeProvider theme={theme}>
        <EntandoVersionForm entandoVersion={entandoVersionMock} onSubmit={handleSubmit} />
      </ThemeProvider>
    );

    const form = getByTestId('entandoVersion-form');
    fireEvent.submit(form);

    await wait(() => {
      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });
  });
});
