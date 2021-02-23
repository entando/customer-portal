import React from 'react';
import { render, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import portalUserMocks from 'components/__mocks__/portalUserMocks';
import { apiPortalUsersGet } from 'api/portalUsers';
import 'i18n/__mocks__/i18nMock';
import PortalUserTableContainer from 'components/PortalUserTableContainer';

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

jest.mock('components/pagination/withPagination', () => {
  const withPagination = Component => {
    return props => (
      <Component
        {...props} // eslint-disable-line react/jsx-props-no-spreading
        pagination={{
          onChangeItemsPerPage: () => {},
          onChangeCurrentPage: () => {},
        }}
      />
    );
  };

  return withPagination;
});

describe('PortalUserTableContainer', () => {
  const errorMessageKey = 'error.dataLoading';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls API', async () => {
    apiPortalUsersGet.mockImplementation(() =>
      Promise.resolve({ portalUsers: portalUserMocks, count: 2 })
    );
    const { queryByText } = render(<PortalUserTableContainer />);

    await wait(() => {
      expect(apiPortalUsersGet).toHaveBeenCalledTimes(1);
      expect(queryByText(errorMessageKey)).not.toBeInTheDocument();
    });
  });

  it('shows an error if the API call is not successful', async () => {
    apiPortalUsersGet.mockImplementation(() => {
      throw new Error();
    });
    const { getByText } = render(<PortalUserTableContainer />);

    wait(() => {
      expect(apiPortalUsersGet).toHaveBeenCalledTimes(1);
      expect(getByText(errorMessageKey)).toBeInTheDocument();
    });
  });
});
