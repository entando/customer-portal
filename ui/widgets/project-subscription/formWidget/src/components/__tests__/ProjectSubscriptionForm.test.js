import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render, wait } from '@testing-library/react';
import 'i18n/__mocks__/i18nMock';
import projectSubscriptionMock from 'components/__mocks__/projectSubscriptionMocks';
import ProjectSubscriptionForm from 'components/ProjectSubscriptionForm';
import { createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';

const theme = createMuiTheme();

describe('ProjectSubscription Form', () => {
  it('shows form', () => {
    const { getByLabelText } = render(
      <ThemeProvider theme={theme}>
        <ProjectSubscriptionForm projectSubscription={projectSubscriptionMock} />
      </ThemeProvider>
    );
    expect(getByLabelText('entities.projectSubscription.level').value).toBe('GOLD');
  });

  it('submits form', async () => {
    const handleSubmit = jest.fn();
    const { getByTestId } = render(
      <ThemeProvider theme={theme}>
        <ProjectSubscriptionForm
          projectSubscription={projectSubscriptionMock}
          onSubmit={handleSubmit}
        />
      </ThemeProvider>
    );

    const form = getByTestId('projectSubscription-form');
    fireEvent.submit(form);

    await wait(() => {
      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });
  });
});
