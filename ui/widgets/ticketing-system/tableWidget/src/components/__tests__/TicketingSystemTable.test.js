import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render } from '@testing-library/react';
import 'components/__mocks__/i18n';
import ticketingSystemMocks from 'components/__mocks__/ticketingSystemMocks';
import TicketingSystemTable from 'components/TicketingSystemTable';

describe('TicketingSystemTable', () => {
  it('shows ticketingSystems', () => {
    const { getByText } = render(<TicketingSystemTable items={ticketingSystemMocks} />);
    expect(
      getByText(
        'Nesciunt exercitationem tenetur et doloremque. Et et deserunt libero ex assumenda suscipit. Aut consequuntur vel hic impedit deserunt aspernatur. Exercitationem sint fugit fugiat id cumque dolor dicta hic.'
      )
    ).toBeInTheDocument();
    expect(
      getByText(
        'Enim sit dolor itaque quam. Qui non cum et sit consectetur culpa. Esse delectus nostrum ut porro asperiores. Aliquam deleniti sunt dolorem quia quae asperiores dolores perferendis.'
      )
    ).toBeInTheDocument();
  });

  it('shows no ticketingSystems message', () => {
    const { queryByText } = render(<TicketingSystemTable items={[]} />);
    expect(
      queryByText(
        'Nesciunt exercitationem tenetur et doloremque. Et et deserunt libero ex assumenda suscipit. Aut consequuntur vel hic impedit deserunt aspernatur. Exercitationem sint fugit fugiat id cumque dolor dicta hic.'
      )
    ).not.toBeInTheDocument();
    expect(
      queryByText(
        'Enim sit dolor itaque quam. Qui non cum et sit consectetur culpa. Esse delectus nostrum ut porro asperiores. Aliquam deleniti sunt dolorem quia quae asperiores dolores perferendis.'
      )
    ).not.toBeInTheDocument();

    expect(queryByText('entities.ticketingSystem.noItems')).toBeInTheDocument();
  });

  it('calls onSelect when the user clicks a table row', () => {
    const onSelectMock = jest.fn();
    const { getByText } = render(
      <TicketingSystemTable items={ticketingSystemMocks} onSelect={onSelectMock} />
    );
    fireEvent.click(
      getByText(
        'Nesciunt exercitationem tenetur et doloremque. Et et deserunt libero ex assumenda suscipit. Aut consequuntur vel hic impedit deserunt aspernatur. Exercitationem sint fugit fugiat id cumque dolor dicta hic.'
      )
    );
    expect(onSelectMock).toHaveBeenCalledTimes(1);
  });
});
