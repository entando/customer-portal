import React from 'react';
import { render, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import 'components/__mocks__/i18n';
import { apiCustomerGet } from 'api/customer';
import customerApiGetResponseMock from 'components/__mocks__/customerMocks';
import CustomerDetailsContainer from 'components/CustomerDetailsContainer';

jest.mock('api/customer');

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
  apiCustomerGet.mockClear();
});

describe('CustomerDetailsContainer component', () => {
  test('requests data when component is mounted', async () => {
    apiCustomerGet.mockImplementation(() => Promise.resolve(customerApiGetResponseMock));

    render(<CustomerDetailsContainer id="1" />);

    await wait(() => {
      expect(apiCustomerGet).toHaveBeenCalledTimes(1);
    });
  });

  test('data is shown after mount API call', async () => {
    apiCustomerGet.mockImplementation(() => Promise.resolve(customerApiGetResponseMock));

    const { getByText } = render(<CustomerDetailsContainer id="1" />);

    await wait(() => {
      expect(apiCustomerGet).toHaveBeenCalledTimes(1);
      expect(getByText('entities.customer.name')).toBeInTheDocument();
      expect(getByText('entities.customer.customerNumber')).toBeInTheDocument();
      expect(getByText('entities.customer.contactName')).toBeInTheDocument();
      expect(getByText('entities.customer.contactPhone')).toBeInTheDocument();
      expect(getByText('entities.customer.contactEmail')).toBeInTheDocument();
      expect(getByText('entities.customer.notes')).toBeInTheDocument();
    });
  });

  test('error is shown after failed API call', async () => {
    const onErrorMock = jest.fn();
    apiCustomerGet.mockImplementation(() => Promise.reject());

    const { getByText } = render(<CustomerDetailsContainer id="1" onError={onErrorMock} />);

    await wait(() => {
      expect(apiCustomerGet).toHaveBeenCalledTimes(1);
      expect(onErrorMock).toHaveBeenCalledTimes(1);
      expect(getByText('common.couldNotFetchData')).toBeInTheDocument();
    });
  });
});
