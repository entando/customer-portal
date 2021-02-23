import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';

import 'components/__mocks__/i18n';
import PartnerDetails from 'components/PartnerDetails';
import partnerMock from 'components/__mocks__/partnerMocks';

describe('PartnerDetails component', () => {
  test('renders data in details widget', () => {
    const { getByText } = render(<PartnerDetails partner={partnerMock} />);

    expect(getByText('entities.partner.name')).toBeInTheDocument();
  });
});
