import React from 'react';
import { fireEvent, render, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { apiPartnerGet, apiPartnerPut } from 'api/partners';
import PartnerEditFormContainer from 'components/PartnerEditFormContainer';
import 'i18n/__mocks__/i18nMock';
import partnerMock from 'components/__mocks__/partnerMocks';

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

describe('PartnerEditFormContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const errorMessageKey = 'error.dataLoading';
  const successMessageKey = 'common.dataSaved';

  const onErrorMock = jest.fn();
  const onUpdateMock = jest.fn();

  it('loads data', async () => {
    apiPartnerGet.mockImplementation(() => Promise.resolve(partnerMock));
    const { queryByText } = render(
      <PartnerEditFormContainer id="1" onError={onErrorMock} onUpdate={onUpdateMock} />
    );

    await wait(() => {
      expect(apiPartnerGet).toHaveBeenCalledTimes(1);
      expect(apiPartnerGet).toHaveBeenCalledWith('', '1');
      expect(queryByText(errorMessageKey)).not.toBeInTheDocument();
      expect(onErrorMock).toHaveBeenCalledTimes(0);
    });
  }, 7000);

  it('saves data', async () => {
    apiPartnerGet.mockImplementation(() => Promise.resolve(partnerMock));
    apiPartnerPut.mockImplementation(() => Promise.resolve(partnerMock));

    const { findByTestId, queryByText } = render(
      <PartnerEditFormContainer id="1" onError={onErrorMock} onUpdate={onUpdateMock} />
    );

    const saveButton = await findByTestId('submit-btn');

    fireEvent.click(saveButton);

    await wait(() => {
      expect(apiPartnerPut).toHaveBeenCalledTimes(1);
      expect(apiPartnerPut).toHaveBeenCalledWith('', partnerMock);
      expect(queryByText(successMessageKey)).toBeInTheDocument();
      expect(onErrorMock).toHaveBeenCalledTimes(0);
      expect(queryByText(errorMessageKey)).not.toBeInTheDocument();
    });
  }, 7000);

  it('shows an error if data is not successfully loaded', async () => {
    apiPartnerGet.mockImplementation(() => Promise.reject());
    const { queryByText } = render(
      <PartnerEditFormContainer id="1" onError={onErrorMock} onUpdate={onUpdateMock} />
    );

    await wait(() => {
      expect(apiPartnerGet).toHaveBeenCalledTimes(1);
      expect(apiPartnerGet).toHaveBeenCalledWith('', '1');
      expect(onErrorMock).toHaveBeenCalledTimes(1);
      expect(queryByText(errorMessageKey)).toBeInTheDocument();
      expect(queryByText(successMessageKey)).not.toBeInTheDocument();
    });
  }, 7000);

  it('shows an error if data is not successfully saved', async () => {
    apiPartnerGet.mockImplementation(() => Promise.resolve(partnerMock));
    apiPartnerPut.mockImplementation(() => Promise.reject());
    const { findByTestId, getByText } = render(
      <PartnerEditFormContainer id="1" onError={onErrorMock} />
    );

    const saveButton = await findByTestId('submit-btn');

    fireEvent.click(saveButton);

    await wait(() => {
      expect(apiPartnerGet).toHaveBeenCalledTimes(1);
      expect(apiPartnerGet).toHaveBeenCalledWith('', '1');

      expect(apiPartnerPut).toHaveBeenCalledTimes(1);
      expect(apiPartnerPut).toHaveBeenCalledWith('', partnerMock);

      expect(onErrorMock).toHaveBeenCalledTimes(1);
      expect(getByText(errorMessageKey)).toBeInTheDocument();
    });
  }, 7000);
});
