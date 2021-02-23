import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render } from '@testing-library/react';
import 'components/__mocks__/i18n';
import portalUserMocks from 'components/__mocks__/portalUserMocks';
import PortalUserTable from 'components/PortalUserTable';

describe('PortalUserTable', () => {
  it('shows portalUsers', () => {
    const { getByText } = render(<PortalUserTable items={portalUserMocks} />);
    expect(
      getByText(
        'Maiores possimus ut et voluptatem cupiditate quod est molestias. Et vel qui non quibusdam occaecati sapiente voluptas. Non quam consequatur aperiam ipsa suscipit quod ratione eum error. Consequuntur voluptas eum et quaerat et.'
      )
    ).toBeInTheDocument();
    expect(
      getByText(
        'Et harum a. Ratione eius fuga dolores non molestiae et eaque sequi. Totam veniam reiciendis qui sed et magni voluptas quo aut. Quaerat fugiat illo natus aliquid accusamus aperiam quidem sed.'
      )
    ).toBeInTheDocument();
  });

  it('shows no portalUsers message', () => {
    const { queryByText } = render(<PortalUserTable items={[]} />);
    expect(
      queryByText(
        'Maiores possimus ut et voluptatem cupiditate quod est molestias. Et vel qui non quibusdam occaecati sapiente voluptas. Non quam consequatur aperiam ipsa suscipit quod ratione eum error. Consequuntur voluptas eum et quaerat et.'
      )
    ).not.toBeInTheDocument();
    expect(
      queryByText(
        'Et harum a. Ratione eius fuga dolores non molestiae et eaque sequi. Totam veniam reiciendis qui sed et magni voluptas quo aut. Quaerat fugiat illo natus aliquid accusamus aperiam quidem sed.'
      )
    ).not.toBeInTheDocument();

    expect(queryByText('entities.portalUser.noItems')).toBeInTheDocument();
  });

  it('calls onSelect when the user clicks a table row', () => {
    const onSelectMock = jest.fn();
    const { getByText } = render(
      <PortalUserTable items={portalUserMocks} onSelect={onSelectMock} />
    );
    fireEvent.click(
      getByText(
        'Maiores possimus ut et voluptatem cupiditate quod est molestias. Et vel qui non quibusdam occaecati sapiente voluptas. Non quam consequatur aperiam ipsa suscipit quod ratione eum error. Consequuntur voluptas eum et quaerat et.'
      )
    );
    expect(onSelectMock).toHaveBeenCalledTimes(1);
  });
});
