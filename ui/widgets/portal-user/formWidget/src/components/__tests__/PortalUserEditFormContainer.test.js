import React from 'react';
import { fireEvent, render, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { apiPortalUserGet, apiPortalUserPut } from 'api/portalUsers';
import PortalUserEditFormContainer from 'components/PortalUserEditFormContainer';
import 'i18n/__mocks__/i18nMock';
import portalUserMock from 'components/__mocks__/portalUserMocks';

jest.mock('api/portalUsers');

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

describe('PortalUserEditFormContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const errorMessageKey = 'error.dataLoading';
  const successMessageKey = 'common.dataSaved';

  const onErrorMock = jest.fn();
  const onUpdateMock = jest.fn();

  it('loads data', async () => {
    apiPortalUserGet.mockImplementation(() => Promise.resolve(portalUserMock));
    const { queryByText } = render(
      <PortalUserEditFormContainer id="1" onError={onErrorMock} onUpdate={onUpdateMock} />
    );

    await wait(() => {
      expect(apiPortalUserGet).toHaveBeenCalledTimes(1);
      expect(apiPortalUserGet).toHaveBeenCalledWith('', '1');
      expect(queryByText(errorMessageKey)).not.toBeInTheDocument();
      expect(onErrorMock).toHaveBeenCalledTimes(0);
    });
  }, 7000);

  it('saves data', async () => {
    apiPortalUserGet.mockImplementation(() => Promise.resolve(portalUserMock));
    apiPortalUserPut.mockImplementation(() => Promise.resolve(portalUserMock));

    const { findByTestId, queryByText } = render(
      <PortalUserEditFormContainer id="1" onError={onErrorMock} onUpdate={onUpdateMock} />
    );

    const saveButton = await findByTestId('submit-btn');

    fireEvent.click(saveButton);

    await wait(() => {
      expect(apiPortalUserPut).toHaveBeenCalledTimes(1);
      expect(apiPortalUserPut).toHaveBeenCalledWith('', portalUserMock);
      expect(queryByText(successMessageKey)).toBeInTheDocument();
      expect(onErrorMock).toHaveBeenCalledTimes(0);
      expect(queryByText(errorMessageKey)).not.toBeInTheDocument();
    });
  }, 7000);

  it('shows an error if data is not successfully loaded', async () => {
    apiPortalUserGet.mockImplementation(() => Promise.reject());
    const { queryByText } = render(
      <PortalUserEditFormContainer id="1" onError={onErrorMock} onUpdate={onUpdateMock} />
    );

    await wait(() => {
      expect(apiPortalUserGet).toHaveBeenCalledTimes(1);
      expect(apiPortalUserGet).toHaveBeenCalledWith('', '1');
      expect(onErrorMock).toHaveBeenCalledTimes(1);
      expect(queryByText(errorMessageKey)).toBeInTheDocument();
      expect(queryByText(successMessageKey)).not.toBeInTheDocument();
    });
  }, 7000);

  it('shows an error if data is not successfully saved', async () => {
    apiPortalUserGet.mockImplementation(() => Promise.resolve(portalUserMock));
    apiPortalUserPut.mockImplementation(() => Promise.reject());
    const { findByTestId, getByText } = render(
      <PortalUserEditFormContainer id="1" onError={onErrorMock} />
    );

    const saveButton = await findByTestId('submit-btn');

    fireEvent.click(saveButton);

    await wait(() => {
      expect(apiPortalUserGet).toHaveBeenCalledTimes(1);
      expect(apiPortalUserGet).toHaveBeenCalledWith('', '1');

      expect(apiPortalUserPut).toHaveBeenCalledTimes(1);
      expect(apiPortalUserPut).toHaveBeenCalledWith('', portalUserMock);

      expect(onErrorMock).toHaveBeenCalledTimes(1);
      expect(getByText(errorMessageKey)).toBeInTheDocument();
    });
  }, 7000);
});
