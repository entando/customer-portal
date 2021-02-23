import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render, wait } from '@testing-library/react';
import 'i18n/__mocks__/i18nMock';
import projectMock from 'components/__mocks__/projectMocks';
import ProjectForm from 'components/ProjectForm';
import { createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';

const theme = createMuiTheme();

describe('Project Form', () => {
  it('shows form', () => {
    const { getByLabelText } = render(
      <ThemeProvider theme={theme}>
        <ProjectForm project={projectMock} />
      </ThemeProvider>
    );
    expect(getByLabelText('entities.project.name').value).toBe(
      'Quae voluptatem non consectetur est eius voluptates facere aut. Et et aut ipsum nisi blanditiis enim architecto. Molestiae placeat saepe fugiat dolore voluptatem.'
    );
  });

  it('submits form', async () => {
    const handleSubmit = jest.fn();
    const { getByTestId } = render(
      <ThemeProvider theme={theme}>
        <ProjectForm project={projectMock} onSubmit={handleSubmit} />
      </ThemeProvider>
    );

    const form = getByTestId('project-form');
    fireEvent.submit(form);

    await wait(() => {
      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });
  });
});
