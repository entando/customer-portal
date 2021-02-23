import React from 'react';
import { render, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import ticketingSystemMocks from 'components/__mocks__/ticketingSystemMocks';
import { apiTicketingSystemsGet } from 'api/ticketingSystems';
import 'i18n/__mocks__/i18nMock';
import TicketingSystemTableContainer from 'components/TicketingSystemTableContainer';

jest.mock('api/ticketingSystems');

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

describe('TicketingSystemTableContainer', () => {
  const errorMessageKey = 'error.dataLoading';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls API', async () => {
    apiTicketingSystemsGet.mockImplementation(() =>
      Promise.resolve({ ticketingSystems: ticketingSystemMocks, count: 2 })
    );
    const { queryByText } = render(<TicketingSystemTableContainer />);

    await wait(() => {
      expect(apiTicketingSystemsGet).toHaveBeenCalledTimes(1);
      expect(queryByText(errorMessageKey)).not.toBeInTheDocument();
    });
  });

  it('shows an error if the API call is not successful', async () => {
    apiTicketingSystemsGet.mockImplementation(() => {
      throw new Error();
    });
    const { getByText } = render(<TicketingSystemTableContainer />);

    wait(() => {
      expect(apiTicketingSystemsGet).toHaveBeenCalledTimes(1);
      expect(getByText(errorMessageKey)).toBeInTheDocument();
    });
  });
});
