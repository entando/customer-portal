import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';

import 'components/__mocks__/i18n';
import ProjectSubscriptionDetails from 'components/ProjectSubscriptionDetails';
import projectSubscriptionMock from 'components/__mocks__/projectSubscriptionMocks';

describe('ProjectSubscriptionDetails component', () => {
  test('renders data in details widget', () => {
    const { getByText } = render(
      <ProjectSubscriptionDetails projectSubscription={projectSubscriptionMock} />
    );

    expect(getByText('entities.projectSubscription.level')).toBeInTheDocument();
  });
});
