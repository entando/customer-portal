import React from 'react';
import { render, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import ticketMocks from 'components/__mocks__/ticketMocks';
import { apiTicketsGet } from 'api/tickets';
import 'i18n/__mocks__/i18nMock';
import TicketTableContainer from 'components/TicketTableContainer';

jest.mock('api/tickets');

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

describe('TicketTableContainer', () => {
  const errorMessageKey = 'error.dataLoading';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls API', async () => {
    apiTicketsGet.mockImplementation(() => Promise.resolve({ tickets: ticketMocks, count: 2 }));
    const { queryByText } = render(<TicketTableContainer />);

    await wait(() => {
      expect(apiTicketsGet).toHaveBeenCalledTimes(1);
      expect(queryByText(errorMessageKey)).not.toBeInTheDocument();
    });
  });

  it('shows an error if the API call is not successful', async () => {
    apiTicketsGet.mockImplementation(() => {
      throw new Error();
    });
    const { getByText } = render(<TicketTableContainer />);

    wait(() => {
      expect(apiTicketsGet).toHaveBeenCalledTimes(1);
      expect(getByText(errorMessageKey)).toBeInTheDocument();
    });
  });
});
