import React from 'react';
import { render, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import partnerMocks from 'components/__mocks__/partnerMocks';
import { apiPartnersGet } from 'api/partners';
import 'i18n/__mocks__/i18nMock';
import PartnerTableContainer from 'components/PartnerTableContainer';

jest.mock('api/partners');

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

describe('PartnerTableContainer', () => {
  const errorMessageKey = 'error.dataLoading';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls API', async () => {
    apiPartnersGet.mockImplementation(() => Promise.resolve({ partners: partnerMocks, count: 2 }));
    const { queryByText } = render(<PartnerTableContainer />);

    await wait(() => {
      expect(apiPartnersGet).toHaveBeenCalledTimes(1);
      expect(queryByText(errorMessageKey)).not.toBeInTheDocument();
    });
  });

  it('shows an error if the API call is not successful', async () => {
    apiPartnersGet.mockImplementation(() => {
      throw new Error();
    });
    const { getByText } = render(<PartnerTableContainer />);

    wait(() => {
      expect(apiPartnersGet).toHaveBeenCalledTimes(1);
      expect(getByText(errorMessageKey)).toBeInTheDocument();
    });
  });
});
