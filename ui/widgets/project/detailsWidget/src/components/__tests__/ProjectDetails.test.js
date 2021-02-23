import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';

import 'components/__mocks__/i18n';
import ProjectDetails from 'components/ProjectDetails';
import projectMock from 'components/__mocks__/projectMocks';

describe('ProjectDetails component', () => {
  test('renders data in details widget', () => {
    const { getByText } = render(<ProjectDetails project={projectMock} />);

    expect(getByText('entities.project.name')).toBeInTheDocument();
  });
});
