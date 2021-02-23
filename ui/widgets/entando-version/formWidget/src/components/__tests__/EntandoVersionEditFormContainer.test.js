import React from 'react';
import { fireEvent, render, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { apiEntandoVersionGet, apiEntandoVersionPut } from 'api/entandoVersions';
import EntandoVersionEditFormContainer from 'components/EntandoVersionEditFormContainer';
import 'i18n/__mocks__/i18nMock';
import entandoVersionMock from 'components/__mocks__/entandoVersionMocks';

jest.mock('api/entandoVersions');

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

describe('EntandoVersionEditFormContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const errorMessageKey = 'error.dataLoading';
  const successMessageKey = 'common.dataSaved';

  const onErrorMock = jest.fn();
  const onUpdateMock = jest.fn();

  it('loads data', async () => {
    apiEntandoVersionGet.mockImplementation(() => Promise.resolve(entandoVersionMock));
    const { queryByText } = render(
      <EntandoVersionEditFormContainer id="1" onError={onErrorMock} onUpdate={onUpdateMock} />
    );

    await wait(() => {
      expect(apiEntandoVersionGet).toHaveBeenCalledTimes(1);
      expect(apiEntandoVersionGet).toHaveBeenCalledWith('', '1');
      expect(queryByText(errorMessageKey)).not.toBeInTheDocument();
      expect(onErrorMock).toHaveBeenCalledTimes(0);
    });
  }, 7000);

  it('saves data', async () => {
    apiEntandoVersionGet.mockImplementation(() => Promise.resolve(entandoVersionMock));
    apiEntandoVersionPut.mockImplementation(() => Promise.resolve(entandoVersionMock));

    const { findByTestId, queryByText } = render(
      <EntandoVersionEditFormContainer id="1" onError={onErrorMock} onUpdate={onUpdateMock} />
    );

    const saveButton = await findByTestId('submit-btn');

    fireEvent.click(saveButton);

    await wait(() => {
      expect(apiEntandoVersionPut).toHaveBeenCalledTimes(1);
      expect(apiEntandoVersionPut).toHaveBeenCalledWith('', entandoVersionMock);
      expect(queryByText(successMessageKey)).toBeInTheDocument();
      expect(onErrorMock).toHaveBeenCalledTimes(0);
      expect(queryByText(errorMessageKey)).not.toBeInTheDocument();
    });
  }, 7000);

  it('shows an error if data is not successfully loaded', async () => {
    apiEntandoVersionGet.mockImplementation(() => Promise.reject());
    const { queryByText } = render(
      <EntandoVersionEditFormContainer id="1" onError={onErrorMock} onUpdate={onUpdateMock} />
    );

    await wait(() => {
      expect(apiEntandoVersionGet).toHaveBeenCalledTimes(1);
      expect(apiEntandoVersionGet).toHaveBeenCalledWith('', '1');
      expect(onErrorMock).toHaveBeenCalledTimes(1);
      expect(queryByText(errorMessageKey)).toBeInTheDocument();
      expect(queryByText(successMessageKey)).not.toBeInTheDocument();
    });
  }, 7000);

  it('shows an error if data is not successfully saved', async () => {
    apiEntandoVersionGet.mockImplementation(() => Promise.resolve(entandoVersionMock));
    apiEntandoVersionPut.mockImplementation(() => Promise.reject());
    const { findByTestId, getByText } = render(
      <EntandoVersionEditFormContainer id="1" onError={onErrorMock} />
    );

    const saveButton = await findByTestId('submit-btn');

    fireEvent.click(saveButton);

    await wait(() => {
      expect(apiEntandoVersionGet).toHaveBeenCalledTimes(1);
      expect(apiEntandoVersionGet).toHaveBeenCalledWith('', '1');

      expect(apiEntandoVersionPut).toHaveBeenCalledTimes(1);
      expect(apiEntandoVersionPut).toHaveBeenCalledWith('', entandoVersionMock);

      expect(onErrorMock).toHaveBeenCalledTimes(1);
      expect(getByText(errorMessageKey)).toBeInTheDocument();
    });
  }, 7000);
});
