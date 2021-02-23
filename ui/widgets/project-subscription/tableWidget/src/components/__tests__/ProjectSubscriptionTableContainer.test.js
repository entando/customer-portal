import React from 'react';
import { render, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import projectSubscriptionMocks from 'components/__mocks__/projectSubscriptionMocks';
import { apiProjectSubscriptionsGet } from 'api/projectSubscriptions';
import 'i18n/__mocks__/i18nMock';
import ProjectSubscriptionTableContainer from 'components/ProjectSubscriptionTableContainer';

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

describe('ProjectSubscriptionTableContainer', () => {
  const errorMessageKey = 'error.dataLoading';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls API', async () => {
    apiProjectSubscriptionsGet.mockImplementation(() =>
      Promise.resolve({ projectSubscriptions: projectSubscriptionMocks, count: 2 })
    );
    const { queryByText } = render(<ProjectSubscriptionTableContainer />);

    await wait(() => {
      expect(apiProjectSubscriptionsGet).toHaveBeenCalledTimes(1);
      expect(queryByText(errorMessageKey)).not.toBeInTheDocument();
    });
  });

  it('shows an error if the API call is not successful', async () => {
    apiProjectSubscriptionsGet.mockImplementation(() => {
      throw new Error();
    });
    const { getByText } = render(<ProjectSubscriptionTableContainer />);

    wait(() => {
      expect(apiProjectSubscriptionsGet).toHaveBeenCalledTimes(1);
      expect(getByText(errorMessageKey)).toBeInTheDocument();
    });
  });
});
