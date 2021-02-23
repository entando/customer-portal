import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render } from '@testing-library/react';
import 'components/__mocks__/i18n';
import projectSubscriptionMocks from 'components/__mocks__/projectSubscriptionMocks';
import ProjectSubscriptionTable from 'components/ProjectSubscriptionTable';

describe('ProjectSubscriptionTable', () => {
  it('shows projectSubscriptions', () => {
    const { getByText } = render(<ProjectSubscriptionTable items={projectSubscriptionMocks} />);
    expect(getByText('GOLD')).toBeInTheDocument();
    expect(getByText('PLATINUM')).toBeInTheDocument();
  });

  it('shows no projectSubscriptions message', () => {
    const { queryByText } = render(<ProjectSubscriptionTable items={[]} />);
    expect(queryByText('GOLD')).not.toBeInTheDocument();
    expect(queryByText('PLATINUM')).not.toBeInTheDocument();

    expect(queryByText('entities.projectSubscription.noItems')).toBeInTheDocument();
  });

  it('calls onSelect when the user clicks a table row', () => {
    const onSelectMock = jest.fn();
    const { getByText } = render(
      <ProjectSubscriptionTable items={projectSubscriptionMocks} onSelect={onSelectMock} />
    );
    fireEvent.click(getByText('GOLD'));
    expect(onSelectMock).toHaveBeenCalledTimes(1);
  });
});
