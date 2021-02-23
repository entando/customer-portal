import React from 'react';
import { render, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import 'components/__mocks__/i18n';
import { apiTicketingSystemGet } from 'api/ticketingSystem';
import ticketingSystemApiGetResponseMock from 'components/__mocks__/ticketingSystemMocks';
import TicketingSystemDetailsContainer from 'components/TicketingSystemDetailsContainer';

jest.mock('api/ticketingSystem');

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
  apiTicketingSystemGet.mockClear();
});

describe('TicketingSystemDetailsContainer component', () => {
  test('requests data when component is mounted', async () => {
    apiTicketingSystemGet.mockImplementation(() =>
      Promise.resolve(ticketingSystemApiGetResponseMock)
    );

    render(<TicketingSystemDetailsContainer id="1" />);

    await wait(() => {
      expect(apiTicketingSystemGet).toHaveBeenCalledTimes(1);
    });
  });

  test('data is shown after mount API call', async () => {
    apiTicketingSystemGet.mockImplementation(() =>
      Promise.resolve(ticketingSystemApiGetResponseMock)
    );

    const { getByText } = render(<TicketingSystemDetailsContainer id="1" />);

    await wait(() => {
      expect(apiTicketingSystemGet).toHaveBeenCalledTimes(1);
      expect(getByText('entities.ticketingSystem.url')).toBeInTheDocument();
      expect(getByText('entities.ticketingSystem.serviceAccount')).toBeInTheDocument();
      expect(getByText('entities.ticketingSystem.serviceAccountSecret')).toBeInTheDocument();
      expect(getByText('entities.ticketingSystem.systemId')).toBeInTheDocument();
    });
  });

  test('error is shown after failed API call', async () => {
    const onErrorMock = jest.fn();
    apiTicketingSystemGet.mockImplementation(() => Promise.reject());

    const { getByText } = render(<TicketingSystemDetailsContainer id="1" onError={onErrorMock} />);

    await wait(() => {
      expect(apiTicketingSystemGet).toHaveBeenCalledTimes(1);
      expect(onErrorMock).toHaveBeenCalledTimes(1);
      expect(getByText('common.couldNotFetchData')).toBeInTheDocument();
    });
  });
});
