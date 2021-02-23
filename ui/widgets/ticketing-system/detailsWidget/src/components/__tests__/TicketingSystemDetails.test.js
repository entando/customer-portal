import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';

import 'components/__mocks__/i18n';
import TicketingSystemDetails from 'components/TicketingSystemDetails';
import ticketingSystemMock from 'components/__mocks__/ticketingSystemMocks';

describe('TicketingSystemDetails component', () => {
  test('renders data in details widget', () => {
    const { getByText } = render(<TicketingSystemDetails ticketingSystem={ticketingSystemMock} />);

    expect(getByText('entities.ticketingSystem.url')).toBeInTheDocument();
  });
});
