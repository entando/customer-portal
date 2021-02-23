import React from 'react';
import { render, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import 'components/__mocks__/i18n';
import { apiEntandoVersionGet } from 'api/entandoVersion';
import entandoVersionApiGetResponseMock from 'components/__mocks__/entandoVersionMocks';
import EntandoVersionDetailsContainer from 'components/EntandoVersionDetailsContainer';

jest.mock('api/entandoVersion');

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
  apiEntandoVersionGet.mockClear();
});

describe('EntandoVersionDetailsContainer component', () => {
  test('requests data when component is mounted', async () => {
    apiEntandoVersionGet.mockImplementation(() =>
      Promise.resolve(entandoVersionApiGetResponseMock)
    );

    render(<EntandoVersionDetailsContainer id="1" />);

    await wait(() => {
      expect(apiEntandoVersionGet).toHaveBeenCalledTimes(1);
    });
  });

  test('data is shown after mount API call', async () => {
    apiEntandoVersionGet.mockImplementation(() =>
      Promise.resolve(entandoVersionApiGetResponseMock)
    );

    const { getByText } = render(<EntandoVersionDetailsContainer id="1" />);

    await wait(() => {
      expect(apiEntandoVersionGet).toHaveBeenCalledTimes(1);
      expect(getByText('entities.entandoVersion.name')).toBeInTheDocument();
    });
  });

  test('error is shown after failed API call', async () => {
    const onErrorMock = jest.fn();
    apiEntandoVersionGet.mockImplementation(() => Promise.reject());

    const { getByText } = render(<EntandoVersionDetailsContainer id="1" onError={onErrorMock} />);

    await wait(() => {
      expect(apiEntandoVersionGet).toHaveBeenCalledTimes(1);
      expect(onErrorMock).toHaveBeenCalledTimes(1);
      expect(getByText('common.couldNotFetchData')).toBeInTheDocument();
    });
  });
});
