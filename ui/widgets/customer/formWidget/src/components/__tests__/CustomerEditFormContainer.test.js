import React from 'react';
import { fireEvent, render, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { apiCustomerGet, apiCustomerPut } from 'api/customers';
import CustomerEditFormContainer from 'components/CustomerEditFormContainer';
import 'i18n/__mocks__/i18nMock';
import customerMock from 'components/__mocks__/customerMocks';

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

describe('CustomerEditFormContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const errorMessageKey = 'error.dataLoading';
  const successMessageKey = 'common.dataSaved';

  const onErrorMock = jest.fn();
  const onUpdateMock = jest.fn();

  it('loads data', async () => {
    apiCustomerGet.mockImplementation(() => Promise.resolve(customerMock));
    const { queryByText } = render(
      <CustomerEditFormContainer id="1" onError={onErrorMock} onUpdate={onUpdateMock} />
    );

    await wait(() => {
      expect(apiCustomerGet).toHaveBeenCalledTimes(1);
      expect(apiCustomerGet).toHaveBeenCalledWith('', '1');
      expect(queryByText(errorMessageKey)).not.toBeInTheDocument();
      expect(onErrorMock).toHaveBeenCalledTimes(0);
    });
  }, 7000);

  it('saves data', async () => {
    apiCustomerGet.mockImplementation(() => Promise.resolve(customerMock));
    apiCustomerPut.mockImplementation(() => Promise.resolve(customerMock));

    const { findByTestId, queryByText } = render(
      <CustomerEditFormContainer id="1" onError={onErrorMock} onUpdate={onUpdateMock} />
    );

    const saveButton = await findByTestId('submit-btn');

    fireEvent.click(saveButton);

    await wait(() => {
      expect(apiCustomerPut).toHaveBeenCalledTimes(1);
      expect(apiCustomerPut).toHaveBeenCalledWith('', customerMock);
      expect(queryByText(successMessageKey)).toBeInTheDocument();
      expect(onErrorMock).toHaveBeenCalledTimes(0);
      expect(queryByText(errorMessageKey)).not.toBeInTheDocument();
    });
  }, 7000);

  it('shows an error if data is not successfully loaded', async () => {
    apiCustomerGet.mockImplementation(() => Promise.reject());
    const { queryByText } = render(
      <CustomerEditFormContainer id="1" onError={onErrorMock} onUpdate={onUpdateMock} />
    );

    await wait(() => {
      expect(apiCustomerGet).toHaveBeenCalledTimes(1);
      expect(apiCustomerGet).toHaveBeenCalledWith('', '1');
      expect(onErrorMock).toHaveBeenCalledTimes(1);
      expect(queryByText(errorMessageKey)).toBeInTheDocument();
      expect(queryByText(successMessageKey)).not.toBeInTheDocument();
    });
  }, 7000);

  it('shows an error if data is not successfully saved', async () => {
    apiCustomerGet.mockImplementation(() => Promise.resolve(customerMock));
    apiCustomerPut.mockImplementation(() => Promise.reject());
    const { findByTestId, getByText } = render(
      <CustomerEditFormContainer id="1" onError={onErrorMock} />
    );

    const saveButton = await findByTestId('submit-btn');

    fireEvent.click(saveButton);

    await wait(() => {
      expect(apiCustomerGet).toHaveBeenCalledTimes(1);
      expect(apiCustomerGet).toHaveBeenCalledWith('', '1');

      expect(apiCustomerPut).toHaveBeenCalledTimes(1);
      expect(apiCustomerPut).toHaveBeenCalledWith('', customerMock);

      expect(onErrorMock).toHaveBeenCalledTimes(1);
      expect(getByText(errorMessageKey)).toBeInTheDocument();
    });
  }, 7000);
});
