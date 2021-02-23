import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render } from '@testing-library/react';
import 'components/__mocks__/i18n';
import ticketMocks from 'components/__mocks__/ticketMocks';
import TicketTable from 'components/TicketTable';

describe('TicketTable', () => {
  it('shows tickets', () => {
    const { getByText } = render(<TicketTable items={ticketMocks} />);
    expect(
      getByText('Sapiente aut architecto. Quo et et aut commodi et qui. Sint est ut.')
    ).toBeInTheDocument();
    expect(
      getByText(
        'Vero velit doloribus blanditiis saepe libero saepe. Repudiandae sint ipsum recusandae error tempora. Vitae ut laudantium. Aut dolor maxime et et voluptas blanditiis voluptas.'
      )
    ).toBeInTheDocument();
  });

  it('shows no tickets message', () => {
    const { queryByText } = render(<TicketTable items={[]} />);
    expect(
      queryByText('Sapiente aut architecto. Quo et et aut commodi et qui. Sint est ut.')
    ).not.toBeInTheDocument();
    expect(
      queryByText(
        'Vero velit doloribus blanditiis saepe libero saepe. Repudiandae sint ipsum recusandae error tempora. Vitae ut laudantium. Aut dolor maxime et et voluptas blanditiis voluptas.'
      )
    ).not.toBeInTheDocument();

    expect(queryByText('entities.ticket.noItems')).toBeInTheDocument();
  });

  it('calls onSelect when the user clicks a table row', () => {
    const onSelectMock = jest.fn();
    const { getByText } = render(<TicketTable items={ticketMocks} onSelect={onSelectMock} />);
    fireEvent.click(
      getByText('Sapiente aut architecto. Quo et et aut commodi et qui. Sint est ut.')
    );
    expect(onSelectMock).toHaveBeenCalledTimes(1);
  });
});
