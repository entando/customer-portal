import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';

import 'components/__mocks__/i18n';
import EntandoVersionDetails from 'components/EntandoVersionDetails';
import entandoVersionMock from 'components/__mocks__/entandoVersionMocks';

describe('EntandoVersionDetails component', () => {
  test('renders data in details widget', () => {
    const { getByText } = render(<EntandoVersionDetails entandoVersion={entandoVersionMock} />);

    expect(getByText('entities.entandoVersion.name')).toBeInTheDocument();
  });
});
