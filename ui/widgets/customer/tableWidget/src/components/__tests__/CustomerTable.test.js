import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render } from '@testing-library/react';
import 'components/__mocks__/i18n';
import customerMocks from 'components/__mocks__/customerMocks';
import CustomerTable from 'components/CustomerTable';

describe('CustomerTable', () => {
  it('shows customers', () => {
    const { getByText } = render(<CustomerTable items={customerMocks} />);
    expect(
      getByText(
        'Id aut aut esse ipsam in. Consequatur animi eos fugiat aut. Inventore ullam explicabo explicabo fuga esse praesentium et sed. Voluptas odio est dolores ea repellendus nemo. Illo quidem provident dolores velit doloribus porro mollitia. Aliquam asperiores qui delectus molestiae enim architecto.'
      )
    ).toBeInTheDocument();
    expect(
      getByText(
        'Sint omnis et voluptatem. Aut quis omnis eos modi eveniet. Blanditiis molestiae enim consequatur ratione voluptatum. Officiis tenetur id aut ut et iure. Voluptatem blanditiis molestiae et voluptatibus modi.'
      )
    ).toBeInTheDocument();
  });

  it('shows no customers message', () => {
    const { queryByText } = render(<CustomerTable items={[]} />);
    expect(
      queryByText(
        'Id aut aut esse ipsam in. Consequatur animi eos fugiat aut. Inventore ullam explicabo explicabo fuga esse praesentium et sed. Voluptas odio est dolores ea repellendus nemo. Illo quidem provident dolores velit doloribus porro mollitia. Aliquam asperiores qui delectus molestiae enim architecto.'
      )
    ).not.toBeInTheDocument();
    expect(
      queryByText(
        'Sint omnis et voluptatem. Aut quis omnis eos modi eveniet. Blanditiis molestiae enim consequatur ratione voluptatum. Officiis tenetur id aut ut et iure. Voluptatem blanditiis molestiae et voluptatibus modi.'
      )
    ).not.toBeInTheDocument();

    expect(queryByText('entities.customer.noItems')).toBeInTheDocument();
  });

  it('calls onSelect when the user clicks a table row', () => {
    const onSelectMock = jest.fn();
    const { getByText } = render(<CustomerTable items={customerMocks} onSelect={onSelectMock} />);
    fireEvent.click(
      getByText(
        'Id aut aut esse ipsam in. Consequatur animi eos fugiat aut. Inventore ullam explicabo explicabo fuga esse praesentium et sed. Voluptas odio est dolores ea repellendus nemo. Illo quidem provident dolores velit doloribus porro mollitia. Aliquam asperiores qui delectus molestiae enim architecto.'
      )
    );
    expect(onSelectMock).toHaveBeenCalledTimes(1);
  });
});
