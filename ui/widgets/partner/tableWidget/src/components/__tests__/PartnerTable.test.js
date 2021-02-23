import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render } from '@testing-library/react';
import 'components/__mocks__/i18n';
import partnerMocks from 'components/__mocks__/partnerMocks';
import PartnerTable from 'components/PartnerTable';

describe('PartnerTable', () => {
  it('shows partners', () => {
    const { getByText } = render(<PartnerTable items={partnerMocks} />);
    expect(
      getByText(
        'Similique reprehenderit et dolor voluptatem et autem eum expedita. Sit laudantium rerum illo aperiam repudiandae excepturi non rerum. Delectus impedit rem qui consequuntur suscipit ab laborum. Odit est eveniet repudiandae quisquam.'
      )
    ).toBeInTheDocument();
    expect(
      getByText(
        'Omnis aliquam libero non asperiores non unde unde. Accusantium occaecati voluptas provident. Culpa eaque voluptas sed libero sunt quam sunt.'
      )
    ).toBeInTheDocument();
  });

  it('shows no partners message', () => {
    const { queryByText } = render(<PartnerTable items={[]} />);
    expect(
      queryByText(
        'Similique reprehenderit et dolor voluptatem et autem eum expedita. Sit laudantium rerum illo aperiam repudiandae excepturi non rerum. Delectus impedit rem qui consequuntur suscipit ab laborum. Odit est eveniet repudiandae quisquam.'
      )
    ).not.toBeInTheDocument();
    expect(
      queryByText(
        'Omnis aliquam libero non asperiores non unde unde. Accusantium occaecati voluptas provident. Culpa eaque voluptas sed libero sunt quam sunt.'
      )
    ).not.toBeInTheDocument();

    expect(queryByText('entities.partner.noItems')).toBeInTheDocument();
  });

  it('calls onSelect when the user clicks a table row', () => {
    const onSelectMock = jest.fn();
    const { getByText } = render(<PartnerTable items={partnerMocks} onSelect={onSelectMock} />);
    fireEvent.click(
      getByText(
        'Similique reprehenderit et dolor voluptatem et autem eum expedita. Sit laudantium rerum illo aperiam repudiandae excepturi non rerum. Delectus impedit rem qui consequuntur suscipit ab laborum. Odit est eveniet repudiandae quisquam.'
      )
    );
    expect(onSelectMock).toHaveBeenCalledTimes(1);
  });
});
