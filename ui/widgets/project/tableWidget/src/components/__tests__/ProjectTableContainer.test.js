import React from 'react';
import { render, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import projectMocks from 'components/__mocks__/projectMocks';
import { apiProjectsGet } from 'api/projects';
import 'i18n/__mocks__/i18nMock';
import ProjectTableContainer from 'components/ProjectTableContainer';

jest.mock('api/projects');

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

jest.mock('components/pagination/withPagination', () => {
  const withPagination = Component => {
    return props => (
      <Component
        {...props} // eslint-disable-line react/jsx-props-no-spreading
        pagination={{
          onChangeItemsPerPage: () => {},
          onChangeCurrentPage: () => {},
        }}
      />
    );
  };

  return withPagination;
});

describe('ProjectTableContainer', () => {
  const errorMessageKey = 'error.dataLoading';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls API', async () => {
    apiProjectsGet.mockImplementation(() => Promise.resolve({ projects: projectMocks, count: 2 }));
    const { queryByText } = render(<ProjectTableContainer />);

    await wait(() => {
      expect(apiProjectsGet).toHaveBeenCalledTimes(1);
      expect(queryByText(errorMessageKey)).not.toBeInTheDocument();
    });
  });

  it('shows an error if the API call is not successful', async () => {
    apiProjectsGet.mockImplementation(() => {
      throw new Error();
    });
    const { getByText } = render(<ProjectTableContainer />);

    wait(() => {
      expect(apiProjectsGet).toHaveBeenCalledTimes(1);
      expect(getByText(errorMessageKey)).toBeInTheDocument();
    });
  });
});
