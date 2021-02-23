import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';

import 'components/__mocks__/i18n';
import PortalUserDetails from 'components/PortalUserDetails';
import portalUserMock from 'components/__mocks__/portalUserMocks';

describe('PortalUserDetails component', () => {
  test('renders data in details widget', () => {
    const { getByText } = render(<PortalUserDetails portalUser={portalUserMock} />);

    expect(getByText('entities.portalUser.username')).toBeInTheDocument();
  });
});
