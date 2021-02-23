import React from 'react';
import { fireEvent, render, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { apiProjectGet, apiProjectPut } from 'api/projects';
import ProjectEditFormContainer from 'components/ProjectEditFormContainer';
import 'i18n/__mocks__/i18nMock';
import projectMock from 'components/__mocks__/projectMocks';

jest.mock('api/projects');

jest.mock('auth/withKeycloak', () => {
  const withKeycloak = Component => {
    return props => (
      <Component
        {...props} // eslint-disable-line react/jsx-props-no-spreading
        keycloak={{
          initialized: true,
          authenticated: true,
        }}
      />
    );
  };

  return withKeycloak;
});

describe('ProjectEditFormContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const errorMessageKey = 'error.dataLoading';
  const successMessageKey = 'common.dataSaved';

  const onErrorMock = jest.fn();
  const onUpdateMock = jest.fn();

  it('loads data', async () => {
    apiProjectGet.mockImplementation(() => Promise.resolve(projectMock));
    const { queryByText } = render(
      <ProjectEditFormContainer id="1" onError={onErrorMock} onUpdate={onUpdateMock} />
    );

    await wait(() => {
      expect(apiProjectGet).toHaveBeenCalledTimes(1);
      expect(apiProjectGet).toHaveBeenCalledWith('', '1');
      expect(queryByText(errorMessageKey)).not.toBeInTheDocument();
      expect(onErrorMock).toHaveBeenCalledTimes(0);
    });
  }, 7000);

  it('saves data', async () => {
    apiProjectGet.mockImplementation(() => Promise.resolve(projectMock));
    apiProjectPut.mockImplementation(() => Promise.resolve(projectMock));

    const { findByTestId, queryByText } = render(
      <ProjectEditFormContainer id="1" onError={onErrorMock} onUpdate={onUpdateMock} />
    );

    const saveButton = await findByTestId('submit-btn');

    fireEvent.click(saveButton);

    await wait(() => {
      expect(apiProjectPut).toHaveBeenCalledTimes(1);
      expect(apiProjectPut).toHaveBeenCalledWith('', projectMock);
      expect(queryByText(successMessageKey)).toBeInTheDocument();
      expect(onErrorMock).toHaveBeenCalledTimes(0);
      expect(queryByText(errorMessageKey)).not.toBeInTheDocument();
    });
  }, 7000);

  it('shows an error if data is not successfully loaded', async () => {
    apiProjectGet.mockImplementation(() => Promise.reject());
    const { queryByText } = render(
      <ProjectEditFormContainer id="1" onError={onErrorMock} onUpdate={onUpdateMock} />
    );

    await wait(() => {
      expect(apiProjectGet).toHaveBeenCalledTimes(1);
      expect(apiProjectGet).toHaveBeenCalledWith('', '1');
      expect(onErrorMock).toHaveBeenCalledTimes(1);
      expect(queryByText(errorMessageKey)).toBeInTheDocument();
      expect(queryByText(successMessageKey)).not.toBeInTheDocument();
    });
  }, 7000);

  it('shows an error if data is not successfully saved', async () => {
    apiProjectGet.mockImplementation(() => Promise.resolve(projectMock));
    apiProjectPut.mockImplementation(() => Promise.reject());
    const { findByTestId, getByText } = render(
      <ProjectEditFormContainer id="1" onError={onErrorMock} />
    );

    const saveButton = await findByTestId('submit-btn');

    fireEvent.click(saveButton);

    await wait(() => {
      expect(apiProjectGet).toHaveBeenCalledTimes(1);
      expect(apiProjectGet).toHaveBeenCalledWith('', '1');

      expect(apiProjectPut).toHaveBeenCalledTimes(1);
      expect(apiProjectPut).toHaveBeenCalledWith('', projectMock);

      expect(onErrorMock).toHaveBeenCalledTimes(1);
      expect(getByText(errorMessageKey)).toBeInTheDocument();
    });
  }, 7000);
});
