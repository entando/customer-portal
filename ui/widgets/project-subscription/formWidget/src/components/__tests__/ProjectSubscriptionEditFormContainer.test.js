import React from 'react';
import { fireEvent, render, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { apiProjectSubscriptionGet, apiProjectSubscriptionPut } from 'api/projectSubscriptions';
import ProjectSubscriptionEditFormContainer from 'components/ProjectSubscriptionEditFormContainer';
import 'i18n/__mocks__/i18nMock';
import projectSubscriptionMock from 'components/__mocks__/projectSubscriptionMocks';

jest.mock('api/projectSubscriptions');

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

describe('ProjectSubscriptionEditFormContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const errorMessageKey = 'error.dataLoading';
  const successMessageKey = 'common.dataSaved';

  const onErrorMock = jest.fn();
  const onUpdateMock = jest.fn();

  it('loads data', async () => {
    apiProjectSubscriptionGet.mockImplementation(() => Promise.resolve(projectSubscriptionMock));
    const { queryByText } = render(
      <ProjectSubscriptionEditFormContainer id="1" onError={onErrorMock} onUpdate={onUpdateMock} />
    );

    await wait(() => {
      expect(apiProjectSubscriptionGet).toHaveBeenCalledTimes(1);
      expect(apiProjectSubscriptionGet).toHaveBeenCalledWith('', '1');
      expect(queryByText(errorMessageKey)).not.toBeInTheDocument();
      expect(onErrorMock).toHaveBeenCalledTimes(0);
    });
  }, 7000);

  it('saves data', async () => {
    apiProjectSubscriptionGet.mockImplementation(() => Promise.resolve(projectSubscriptionMock));
    apiProjectSubscriptionPut.mockImplementation(() => Promise.resolve(projectSubscriptionMock));

    const { findByTestId, queryByText } = render(
      <ProjectSubscriptionEditFormContainer id="1" onError={onErrorMock} onUpdate={onUpdateMock} />
    );

    const saveButton = await findByTestId('submit-btn');

    fireEvent.click(saveButton);

    await wait(() => {
      expect(apiProjectSubscriptionPut).toHaveBeenCalledTimes(1);
      expect(apiProjectSubscriptionPut).toHaveBeenCalledWith('', projectSubscriptionMock);
      expect(queryByText(successMessageKey)).toBeInTheDocument();
      expect(onErrorMock).toHaveBeenCalledTimes(0);
      expect(queryByText(errorMessageKey)).not.toBeInTheDocument();
    });
  }, 7000);

  it('shows an error if data is not successfully loaded', async () => {
    apiProjectSubscriptionGet.mockImplementation(() => Promise.reject());
    const { queryByText } = render(
      <ProjectSubscriptionEditFormContainer id="1" onError={onErrorMock} onUpdate={onUpdateMock} />
    );

    await wait(() => {
      expect(apiProjectSubscriptionGet).toHaveBeenCalledTimes(1);
      expect(apiProjectSubscriptionGet).toHaveBeenCalledWith('', '1');
      expect(onErrorMock).toHaveBeenCalledTimes(1);
      expect(queryByText(errorMessageKey)).toBeInTheDocument();
      expect(queryByText(successMessageKey)).not.toBeInTheDocument();
    });
  }, 7000);

  it('shows an error if data is not successfully saved', async () => {
    apiProjectSubscriptionGet.mockImplementation(() => Promise.resolve(projectSubscriptionMock));
    apiProjectSubscriptionPut.mockImplementation(() => Promise.reject());
    const { findByTestId, getByText } = render(
      <ProjectSubscriptionEditFormContainer id="1" onError={onErrorMock} />
    );

    const saveButton = await findByTestId('submit-btn');

    fireEvent.click(saveButton);

    await wait(() => {
      expect(apiProjectSubscriptionGet).toHaveBeenCalledTimes(1);
      expect(apiProjectSubscriptionGet).toHaveBeenCalledWith('', '1');

      expect(apiProjectSubscriptionPut).toHaveBeenCalledTimes(1);
      expect(apiProjectSubscriptionPut).toHaveBeenCalledWith('', projectSubscriptionMock);

      expect(onErrorMock).toHaveBeenCalledTimes(1);
      expect(getByText(errorMessageKey)).toBeInTheDocument();
    });
  }, 7000);
});
