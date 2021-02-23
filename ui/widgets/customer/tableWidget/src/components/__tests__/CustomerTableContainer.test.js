import React from 'react';
import { render, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import customerMocks from 'components/__mocks__/customerMocks';
import { apiCustomersGet } from 'api/customers';
import 'i18n/__mocks__/i18nMock';
import CustomerTableContainer from 'components/CustomerTableContainer';

jest.mock('api/customers');

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

describe('CustomerTableContainer', () => {
  const errorMessageKey = 'error.dataLoading';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls API', async () => {
    apiCustomersGet.mockImplementation(() =>
      Promise.resolve({ customers: customerMocks, count: 2 })
    );
    const { queryByText } = render(<CustomerTableContainer />);

    await wait(() => {
      expect(apiCustomersGet).toHaveBeenCalledTimes(1);
      expect(queryByText(errorMessageKey)).not.toBeInTheDocument();
    });
  });

  it('shows an error if the API call is not successful', async () => {
    apiCustomersGet.mockImplementation(() => {
      throw new Error();
    });
    const { getByText } = render(<CustomerTableContainer />);

    wait(() => {
      expect(apiCustomersGet).toHaveBeenCalledTimes(1);
      expect(getByText(errorMessageKey)).toBeInTheDocument();
    });
  });
});
