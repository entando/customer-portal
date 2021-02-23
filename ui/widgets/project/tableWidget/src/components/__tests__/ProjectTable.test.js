import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render } from '@testing-library/react';
import 'components/__mocks__/i18n';
import projectMocks from 'components/__mocks__/projectMocks';
import ProjectTable from 'components/ProjectTable';

describe('ProjectTable', () => {
  it('shows projects', () => {
    const { getByText } = render(<ProjectTable items={projectMocks} />);
    expect(
      getByText(
        'Quae voluptatem non consectetur est eius voluptates facere aut. Et et aut ipsum nisi blanditiis enim architecto. Molestiae placeat saepe fugiat dolore voluptatem.'
      )
    ).toBeInTheDocument();
    expect(
      getByText(
        'Possimus ipsum magni distinctio in laudantium necessitatibus. Dolor rem nulla numquam. Autem minus quas aspernatur iure necessitatibus molestiae neque fugit.'
      )
    ).toBeInTheDocument();
  });

  it('shows no projects message', () => {
    const { queryByText } = render(<ProjectTable items={[]} />);
    expect(
      queryByText(
        'Quae voluptatem non consectetur est eius voluptates facere aut. Et et aut ipsum nisi blanditiis enim architecto. Molestiae placeat saepe fugiat dolore voluptatem.'
      )
    ).not.toBeInTheDocument();
    expect(
      queryByText(
        'Possimus ipsum magni distinctio in laudantium necessitatibus. Dolor rem nulla numquam. Autem minus quas aspernatur iure necessitatibus molestiae neque fugit.'
      )
    ).not.toBeInTheDocument();

    expect(queryByText('entities.project.noItems')).toBeInTheDocument();
  });

  it('calls onSelect when the user clicks a table row', () => {
    const onSelectMock = jest.fn();
    const { getByText } = render(<ProjectTable items={projectMocks} onSelect={onSelectMock} />);
    fireEvent.click(
      getByText(
        'Quae voluptatem non consectetur est eius voluptates facere aut. Et et aut ipsum nisi blanditiis enim architecto. Molestiae placeat saepe fugiat dolore voluptatem.'
      )
    );
    expect(onSelectMock).toHaveBeenCalledTimes(1);
  });
});
