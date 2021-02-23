import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render, wait } from '@testing-library/react';
import 'i18n/__mocks__/i18nMock';
import customerMock from 'components/__mocks__/customerMocks';
import CustomerForm from 'components/CustomerForm';
import { createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';

const theme = createMuiTheme();

describe('Customer Form', () => {
  it('shows form', () => {
    const { getByLabelText } = render(
      <ThemeProvider theme={theme}>
        <CustomerForm customer={customerMock} />
      </ThemeProvider>
    );
    expect(getByLabelText('entities.customer.name').value).toBe(
      'Id aut aut esse ipsam in. Consequatur animi eos fugiat aut. Inventore ullam explicabo explicabo fuga esse praesentium et sed. Voluptas odio est dolores ea repellendus nemo. Illo quidem provident dolores velit doloribus porro mollitia. Aliquam asperiores qui delectus molestiae enim architecto.'
    );
  });

  it('submits form', async () => {
    const handleSubmit = jest.fn();
    const { getByTestId } = render(
      <ThemeProvider theme={theme}>
        <CustomerForm customer={customerMock} onSubmit={handleSubmit} />
      </ThemeProvider>
    );

    const form = getByTestId('customer-form');
    fireEvent.submit(form);

    await wait(() => {
      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });
  });
});
