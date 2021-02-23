import React from 'react';
import { render, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import 'components/__mocks__/i18n';
import { apiPartnerGet } from 'api/partner';
import partnerApiGetResponseMock from 'components/__mocks__/partnerMocks';
import PartnerDetailsContainer from 'components/PartnerDetailsContainer';

jest.mock('api/partner');

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
  apiPartnerGet.mockClear();
});

describe('PartnerDetailsContainer component', () => {
  test('requests data when component is mounted', async () => {
    apiPartnerGet.mockImplementation(() => Promise.resolve(partnerApiGetResponseMock));

    render(<PartnerDetailsContainer id="1" />);

    await wait(() => {
      expect(apiPartnerGet).toHaveBeenCalledTimes(1);
    });
  });

  test('data is shown after mount API call', async () => {
    apiPartnerGet.mockImplementation(() => Promise.resolve(partnerApiGetResponseMock));

    const { getByText } = render(<PartnerDetailsContainer id="1" />);

    await wait(() => {
      expect(apiPartnerGet).toHaveBeenCalledTimes(1);
      expect(getByText('entities.partner.name')).toBeInTheDocument();
      expect(getByText('entities.partner.partnerNumber')).toBeInTheDocument();
      expect(getByText('entities.partner.notes')).toBeInTheDocument();
    });
  });

  test('error is shown after failed API call', async () => {
    const onErrorMock = jest.fn();
    apiPartnerGet.mockImplementation(() => Promise.reject());

    const { getByText } = render(<PartnerDetailsContainer id="1" onError={onErrorMock} />);

    await wait(() => {
      expect(apiPartnerGet).toHaveBeenCalledTimes(1);
      expect(onErrorMock).toHaveBeenCalledTimes(1);
      expect(getByText('common.couldNotFetchData')).toBeInTheDocument();
    });
  });
});
