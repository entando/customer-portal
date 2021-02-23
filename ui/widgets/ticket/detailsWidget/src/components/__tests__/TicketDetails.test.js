import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';

import 'components/__mocks__/i18n';
import TicketDetails from 'components/TicketDetails';
import ticketMock from 'components/__mocks__/ticketMocks';

describe('TicketDetails component', () => {
  test('renders data in details widget', () => {
    const { getByText } = render(<TicketDetails ticket={ticketMock} />);

    expect(getByText('entities.ticket.systemId')).toBeInTheDocument();
  });
});
