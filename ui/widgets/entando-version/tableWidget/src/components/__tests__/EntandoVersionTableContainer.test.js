import React from 'react';
import { render, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import entandoVersionMocks from 'components/__mocks__/entandoVersionMocks';
import { apiEntandoVersionsGet } from 'api/entandoVersions';
import 'i18n/__mocks__/i18nMock';
import EntandoVersionTableContainer from 'components/EntandoVersionTableContainer';

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

describe('EntandoVersionTableContainer', () => {
  const errorMessageKey = 'error.dataLoading';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls API', async () => {
    apiEntandoVersionsGet.mockImplementation(() =>
      Promise.resolve({ entandoVersions: entandoVersionMocks, count: 2 })
    );
    const { queryByText } = render(<EntandoVersionTableContainer />);

    await wait(() => {
      expect(apiEntandoVersionsGet).toHaveBeenCalledTimes(1);
      expect(queryByText(errorMessageKey)).not.toBeInTheDocument();
    });
  });

  it('shows an error if the API call is not successful', async () => {
    apiEntandoVersionsGet.mockImplementation(() => {
      throw new Error();
    });
    const { getByText } = render(<EntandoVersionTableContainer />);

    wait(() => {
      expect(apiEntandoVersionsGet).toHaveBeenCalledTimes(1);
      expect(getByText(errorMessageKey)).toBeInTheDocument();
    });
  });
});
