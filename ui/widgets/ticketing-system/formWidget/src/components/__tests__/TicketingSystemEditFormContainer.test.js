import React from 'react';
import { fireEvent, render, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { apiTicketingSystemGet, apiTicketingSystemPut } from 'api/ticketingSystems';
import TicketingSystemEditFormContainer from 'components/TicketingSystemEditFormContainer';
import 'i18n/__mocks__/i18nMock';
import ticketingSystemMock from 'components/__mocks__/ticketingSystemMocks';

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

describe('TicketingSystemEditFormContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const errorMessageKey = 'error.dataLoading';
  const successMessageKey = 'common.dataSaved';

  const onErrorMock = jest.fn();
  const onUpdateMock = jest.fn();

  it('loads data', async () => {
    apiTicketingSystemGet.mockImplementation(() => Promise.resolve(ticketingSystemMock));
    const { queryByText } = render(
      <TicketingSystemEditFormContainer id="1" onError={onErrorMock} onUpdate={onUpdateMock} />
    );

    await wait(() => {
      expect(apiTicketingSystemGet).toHaveBeenCalledTimes(1);
      expect(apiTicketingSystemGet).toHaveBeenCalledWith('', '1');
      expect(queryByText(errorMessageKey)).not.toBeInTheDocument();
      expect(onErrorMock).toHaveBeenCalledTimes(0);
    });
  }, 7000);

  it('saves data', async () => {
    apiTicketingSystemGet.mockImplementation(() => Promise.resolve(ticketingSystemMock));
    apiTicketingSystemPut.mockImplementation(() => Promise.resolve(ticketingSystemMock));

    const { findByTestId, queryByText } = render(
      <TicketingSystemEditFormContainer id="1" onError={onErrorMock} onUpdate={onUpdateMock} />
    );

    const saveButton = await findByTestId('submit-btn');

    fireEvent.click(saveButton);

    await wait(() => {
      expect(apiTicketingSystemPut).toHaveBeenCalledTimes(1);
      expect(apiTicketingSystemPut).toHaveBeenCalledWith('', ticketingSystemMock);
      expect(queryByText(successMessageKey)).toBeInTheDocument();
      expect(onErrorMock).toHaveBeenCalledTimes(0);
      expect(queryByText(errorMessageKey)).not.toBeInTheDocument();
    });
  }, 7000);

  it('shows an error if data is not successfully loaded', async () => {
    apiTicketingSystemGet.mockImplementation(() => Promise.reject());
    const { queryByText } = render(
      <TicketingSystemEditFormContainer id="1" onError={onErrorMock} onUpdate={onUpdateMock} />
    );

    await wait(() => {
      expect(apiTicketingSystemGet).toHaveBeenCalledTimes(1);
      expect(apiTicketingSystemGet).toHaveBeenCalledWith('', '1');
      expect(onErrorMock).toHaveBeenCalledTimes(1);
      expect(queryByText(errorMessageKey)).toBeInTheDocument();
      expect(queryByText(successMessageKey)).not.toBeInTheDocument();
    });
  }, 7000);

  it('shows an error if data is not successfully saved', async () => {
    apiTicketingSystemGet.mockImplementation(() => Promise.resolve(ticketingSystemMock));
    apiTicketingSystemPut.mockImplementation(() => Promise.reject());
    const { findByTestId, getByText } = render(
      <TicketingSystemEditFormContainer id="1" onError={onErrorMock} />
    );

    const saveButton = await findByTestId('submit-btn');

    fireEvent.click(saveButton);

    await wait(() => {
      expect(apiTicketingSystemGet).toHaveBeenCalledTimes(1);
      expect(apiTicketingSystemGet).toHaveBeenCalledWith('', '1');

      expect(apiTicketingSystemPut).toHaveBeenCalledTimes(1);
      expect(apiTicketingSystemPut).toHaveBeenCalledWith('', ticketingSystemMock);

      expect(onErrorMock).toHaveBeenCalledTimes(1);
      expect(getByText(errorMessageKey)).toBeInTheDocument();
    });
  }, 7000);
});
