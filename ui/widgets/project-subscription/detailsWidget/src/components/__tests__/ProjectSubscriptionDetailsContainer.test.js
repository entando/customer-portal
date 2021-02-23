import React from 'react';
import { render, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import 'components/__mocks__/i18n';
import { apiProjectSubscriptionGet } from 'api/projectSubscription';
import projectSubscriptionApiGetResponseMock from 'components/__mocks__/projectSubscriptionMocks';
import ProjectSubscriptionDetailsContainer from 'components/ProjectSubscriptionDetailsContainer';

jest.mock('api/projectSubscription');

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
  apiProjectSubscriptionGet.mockClear();
});

describe('ProjectSubscriptionDetailsContainer component', () => {
  test('requests data when component is mounted', async () => {
    apiProjectSubscriptionGet.mockImplementation(() =>
      Promise.resolve(projectSubscriptionApiGetResponseMock)
    );

    render(<ProjectSubscriptionDetailsContainer id="1" />);

    await wait(() => {
      expect(apiProjectSubscriptionGet).toHaveBeenCalledTimes(1);
    });
  });

  test('data is shown after mount API call', async () => {
    apiProjectSubscriptionGet.mockImplementation(() =>
      Promise.resolve(projectSubscriptionApiGetResponseMock)
    );

    const { getByText } = render(<ProjectSubscriptionDetailsContainer id="1" />);

    await wait(() => {
      expect(apiProjectSubscriptionGet).toHaveBeenCalledTimes(1);
      expect(getByText('entities.projectSubscription.level')).toBeInTheDocument();
      expect(getByText('entities.projectSubscription.status')).toBeInTheDocument();
      expect(getByText('entities.projectSubscription.lengthInMonths')).toBeInTheDocument();
      expect(getByText('entities.projectSubscription.startDate')).toBeInTheDocument();
      expect(getByText('entities.projectSubscription.notes')).toBeInTheDocument();
    });
  });

  test('error is shown after failed API call', async () => {
    const onErrorMock = jest.fn();
    apiProjectSubscriptionGet.mockImplementation(() => Promise.reject());

    const { getByText } = render(
      <ProjectSubscriptionDetailsContainer id="1" onError={onErrorMock} />
    );

    await wait(() => {
      expect(apiProjectSubscriptionGet).toHaveBeenCalledTimes(1);
      expect(onErrorMock).toHaveBeenCalledTimes(1);
      expect(getByText('common.couldNotFetchData')).toBeInTheDocument();
    });
  });
});
