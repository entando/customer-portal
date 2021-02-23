import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render } from '@testing-library/react';
import 'components/__mocks__/i18n';
import entandoVersionMocks from 'components/__mocks__/entandoVersionMocks';
import EntandoVersionTable from 'components/EntandoVersionTable';

describe('EntandoVersionTable', () => {
  it('shows entandoVersions', () => {
    const { getByText } = render(<EntandoVersionTable items={entandoVersionMocks} />);
    expect(
      getByText(
        'Dolorem tempora commodi aspernatur quo nesciunt debitis culpa et. Rerum sint ut est dolore excepturi reprehenderit. Quo nobis aut vero id molestiae. Natus porro dicta occaecati et consequatur in occaecati voluptate.'
      )
    ).toBeInTheDocument();
    expect(
      getByText(
        'Doloribus consequatur expedita est nam aut atque dolor dignissimos. Eveniet assumenda rem dolores sequi. Et maxime sed nihil tenetur et voluptatem. Ducimus et incidunt consequuntur et voluptatem velit beatae excepturi. Magnam sunt sint nobis.'
      )
    ).toBeInTheDocument();
  });

  it('shows no entandoVersions message', () => {
    const { queryByText } = render(<EntandoVersionTable items={[]} />);
    expect(
      queryByText(
        'Dolorem tempora commodi aspernatur quo nesciunt debitis culpa et. Rerum sint ut est dolore excepturi reprehenderit. Quo nobis aut vero id molestiae. Natus porro dicta occaecati et consequatur in occaecati voluptate.'
      )
    ).not.toBeInTheDocument();
    expect(
      queryByText(
        'Doloribus consequatur expedita est nam aut atque dolor dignissimos. Eveniet assumenda rem dolores sequi. Et maxime sed nihil tenetur et voluptatem. Ducimus et incidunt consequuntur et voluptatem velit beatae excepturi. Magnam sunt sint nobis.'
      )
    ).not.toBeInTheDocument();

    expect(queryByText('entities.entandoVersion.noItems')).toBeInTheDocument();
  });

  it('calls onSelect when the user clicks a table row', () => {
    const onSelectMock = jest.fn();
    const { getByText } = render(
      <EntandoVersionTable items={entandoVersionMocks} onSelect={onSelectMock} />
    );
    fireEvent.click(
      getByText(
        'Dolorem tempora commodi aspernatur quo nesciunt debitis culpa et. Rerum sint ut est dolore excepturi reprehenderit. Quo nobis aut vero id molestiae. Natus porro dicta occaecati et consequatur in occaecati voluptate.'
      )
    );
    expect(onSelectMock).toHaveBeenCalledTimes(1);
  });
});
