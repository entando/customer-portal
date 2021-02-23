import React from 'react';
import { render, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import 'components/__mocks__/i18n';
import { apiPortalUserGet } from 'api/portalUser';
import portalUserApiGetResponseMock from 'components/__mocks__/portalUserMocks';
import PortalUserDetailsContainer from 'components/PortalUserDetailsContainer';

jest.mock('api/portalUser');

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

beforeEach(() => {
  apiPortalUserGet.mockClear();
});

describe('PortalUserDetailsContainer component', () => {
  test('requests data when component is mounted', async () => {
    apiPortalUserGet.mockImplementation(() => Promise.resolve(portalUserApiGetResponseMock));

    render(<PortalUserDetailsContainer id="1" />);

    await wait(() => {
      expect(apiPortalUserGet).toHaveBeenCalledTimes(1);
    });
  });

  test('data is shown after mount API call', async () => {
    apiPortalUserGet.mockImplementation(() => Promise.resolve(portalUserApiGetResponseMock));

    const { getByText } = render(<PortalUserDetailsContainer id="1" />);

    await wait(() => {
      expect(apiPortalUserGet).toHaveBeenCalledTimes(1);
      expect(getByText('entities.portalUser.username')).toBeInTheDocument();
      expect(getByText('entities.portalUser.email')).toBeInTheDocument();
    });
  });

  test('error is shown after failed API call', async () => {
    const onErrorMock = jest.fn();
    apiPortalUserGet.mockImplementation(() => Promise.reject());

    const { getByText } = render(<PortalUserDetailsContainer id="1" onError={onErrorMock} />);

    await wait(() => {
      expect(apiPortalUserGet).toHaveBeenCalledTimes(1);
      expect(onErrorMock).toHaveBeenCalledTimes(1);
      expect(getByText('common.couldNotFetchData')).toBeInTheDocument();
    });
  });
});
