import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';

import 'components/__mocks__/i18n';
import CustomerDetails from 'components/CustomerDetails';
import customerMock from 'components/__mocks__/customerMocks';

describe('CustomerDetails component', () => {
  test('renders data in details widget', () => {
    const { getByText } = render(<CustomerDetails customer={customerMock} />);

    expect(getByText('entities.customer.name')).toBeInTheDocument();
  });
});
