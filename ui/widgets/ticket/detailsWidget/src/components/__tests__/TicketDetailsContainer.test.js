import React from 'react';
import { render, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import 'components/__mocks__/i18n';
import { apiTicketGet } from 'api/ticket';
import ticketApiGetResponseMock from 'components/__mocks__/ticketMocks';
import TicketDetailsContainer from 'components/TicketDetailsContainer';

jest.mock('api/ticket');

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
  apiTicketGet.mockClear();
});

describe('TicketDetailsContainer component', () => {
  test('requests data when component is mounted', async () => {
    apiTicketGet.mockImplementation(() => Promise.resolve(ticketApiGetResponseMock));

    render(<TicketDetailsContainer id="1" />);

    await wait(() => {
      expect(apiTicketGet).toHaveBeenCalledTimes(1);
    });
  });

  test('data is shown after mount API call', async () => {
    apiTicketGet.mockImplementation(() => Promise.resolve(ticketApiGetResponseMock));

    const { getByText } = render(<TicketDetailsContainer id="1" />);

    await wait(() => {
      expect(apiTicketGet).toHaveBeenCalledTimes(1);
      expect(getByText('entities.ticket.systemId')).toBeInTheDocument();
      expect(getByText('entities.ticket.type')).toBeInTheDocument();
      expect(getByText('entities.ticket.description')).toBeInTheDocument();
      expect(getByText('entities.ticket.priority')).toBeInTheDocument();
      expect(getByText('entities.ticket.status')).toBeInTheDocument();
      expect(getByText('entities.ticket.createDate')).toBeInTheDocument();
      expect(getByText('entities.ticket.updateDate')).toBeInTheDocument();
    });
  });

  test('error is shown after failed API call', async () => {
    const onErrorMock = jest.fn();
    apiTicketGet.mockImplementation(() => Promise.reject());

    const { getByText } = render(<TicketDetailsContainer id="1" onError={onErrorMock} />);

    await wait(() => {
      expect(apiTicketGet).toHaveBeenCalledTimes(1);
      expect(onErrorMock).toHaveBeenCalledTimes(1);
      expect(getByText('common.couldNotFetchData')).toBeInTheDocument();
    });
  });
});
