import React from 'react';
import { fireEvent, render, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { apiTicketGet, apiTicketPut } from 'api/tickets';
import TicketEditFormContainer from 'components/TicketEditFormContainer';
import 'i18n/__mocks__/i18nMock';
import ticketMock from 'components/__mocks__/ticketMocks';

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

describe('TicketEditFormContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const errorMessageKey = 'error.dataLoading';
  const successMessageKey = 'common.dataSaved';

  const onErrorMock = jest.fn();
  const onUpdateMock = jest.fn();

  it('loads data', async () => {
    apiTicketGet.mockImplementation(() => Promise.resolve(ticketMock));
    const { queryByText } = render(
      <TicketEditFormContainer id="1" onError={onErrorMock} onUpdate={onUpdateMock} />
    );

    await wait(() => {
      expect(apiTicketGet).toHaveBeenCalledTimes(1);
      expect(apiTicketGet).toHaveBeenCalledWith('', '1');
      expect(queryByText(errorMessageKey)).not.toBeInTheDocument();
      expect(onErrorMock).toHaveBeenCalledTimes(0);
    });
  }, 7000);

  it('saves data', async () => {
    apiTicketGet.mockImplementation(() => Promise.resolve(ticketMock));
    apiTicketPut.mockImplementation(() => Promise.resolve(ticketMock));

    const { findByTestId, queryByText } = render(
      <TicketEditFormContainer id="1" onError={onErrorMock} onUpdate={onUpdateMock} />
    );

    const saveButton = await findByTestId('submit-btn');

    fireEvent.click(saveButton);

    await wait(() => {
      expect(apiTicketPut).toHaveBeenCalledTimes(1);
      expect(apiTicketPut).toHaveBeenCalledWith('', ticketMock);
      expect(queryByText(successMessageKey)).toBeInTheDocument();
      expect(onErrorMock).toHaveBeenCalledTimes(0);
      expect(queryByText(errorMessageKey)).not.toBeInTheDocument();
    });
  }, 7000);

  it('shows an error if data is not successfully loaded', async () => {
    apiTicketGet.mockImplementation(() => Promise.reject());
    const { queryByText } = render(
      <TicketEditFormContainer id="1" onError={onErrorMock} onUpdate={onUpdateMock} />
    );

    await wait(() => {
      expect(apiTicketGet).toHaveBeenCalledTimes(1);
      expect(apiTicketGet).toHaveBeenCalledWith('', '1');
      expect(onErrorMock).toHaveBeenCalledTimes(1);
      expect(queryByText(errorMessageKey)).toBeInTheDocument();
      expect(queryByText(successMessageKey)).not.toBeInTheDocument();
    });
  }, 7000);

  it('shows an error if data is not successfully saved', async () => {
    apiTicketGet.mockImplementation(() => Promise.resolve(ticketMock));
    apiTicketPut.mockImplementation(() => Promise.reject());
    const { findByTestId, getByText } = render(
      <TicketEditFormContainer id="1" onError={onErrorMock} />
    );

    const saveButton = await findByTestId('submit-btn');

    fireEvent.click(saveButton);

    await wait(() => {
      expect(apiTicketGet).toHaveBeenCalledTimes(1);
      expect(apiTicketGet).toHaveBeenCalledWith('', '1');

      expect(apiTicketPut).toHaveBeenCalledTimes(1);
      expect(apiTicketPut).toHaveBeenCalledWith('', ticketMock);

      expect(onErrorMock).toHaveBeenCalledTimes(1);
      expect(getByText(errorMessageKey)).toBeInTheDocument();
    });
  }, 7000);
});
