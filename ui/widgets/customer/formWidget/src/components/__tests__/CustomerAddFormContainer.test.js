import React from 'react';
import { fireEvent, render, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { apiCustomerPost } from 'api/customers';
import CustomerAddFormContainer from 'components/CustomerAddFormContainer';
import 'i18n/__mocks__/i18nMock';
import customerMock from 'components/__mocks__/customerMocks';

jest.mock('api/customers');
jest.mock('@material-ui/pickers', () => {
  // eslint-disable-next-line react/prop-types
  const MockPicker = ({ id, value, name, label, onChange }) => {
    const handleChange = event => onChange(event.currentTarget.value);
    return (
      <span>
        <label htmlFor={id}>{label}</label>
        <input id={id} name={name} value={value || ''} onChange={handleChange} />
      </span>
    );
  };
  return {
    ...jest.requireActual('@material-ui/pickers'),
    DateTimePicker: MockPicker,
    DatePicker: MockPicker,
  };
});

jest.mock('auth/withKeycloak', () => {
  const withKeycloak = Component => {
    return props => (
      <Component
        {...props} // eslint-disable-line react/jsx-props-no-spreading
        keycloak={{
          initialized: true,
          authenticated: true,
        }}
      />
    );
  };

  return withKeycloak;
});

describe('CustomerAddFormContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const errorMessageKey = 'error.dataLoading';
  const successMessageKey = 'common.dataSaved';

  const onErrorMock = jest.fn();
  const onCreateMock = jest.fn();

  it('saves data', async () => {
    apiCustomerPost.mockImplementation(data => Promise.resolve(data));

    const { findByTestId, findByLabelText, queryByText, rerender } = render(
      <CustomerAddFormContainer onError={onErrorMock} onUpdate={onCreateMock} />
    );

    const nameField = await findByLabelText('entities.customer.name');
    fireEvent.change(nameField, { target: { value: customerMock.name } });
    const customerNumberField = await findByLabelText('entities.customer.customerNumber');
    fireEvent.change(customerNumberField, { target: { value: customerMock.customerNumber } });
    const contactNameField = await findByLabelText('entities.customer.contactName');
    fireEvent.change(contactNameField, { target: { value: customerMock.contactName } });
    const contactPhoneField = await findByLabelText('entities.customer.contactPhone');
    fireEvent.change(contactPhoneField, { target: { value: customerMock.contactPhone } });
    const contactEmailField = await findByLabelText('entities.customer.contactEmail');
    fireEvent.change(contactEmailField, { target: { value: customerMock.contactEmail } });
    const notesField = await findByLabelText('entities.customer.notes');
    fireEvent.change(notesField, { target: { value: customerMock.notes } });
    rerender(<CustomerAddFormContainer onError={onErrorMock} onUpdate={onCreateMock} />);

    const saveButton = await findByTestId('submit-btn');

    fireEvent.click(saveButton);

    await wait(() => {
      expect(apiCustomerPost).toHaveBeenCalledTimes(1);
      expect(apiCustomerPost).toHaveBeenCalledWith('', customerMock);

      expect(queryByText(successMessageKey)).toBeInTheDocument();

      expect(onErrorMock).toHaveBeenCalledTimes(0);
      expect(queryByText(errorMessageKey)).not.toBeInTheDocument();
    });
  }, 7000);

  it('shows an error if data is not successfully saved', async () => {
    apiCustomerPost.mockImplementation(() => Promise.reject());

    const { findByTestId, findByLabelText, queryByText, rerender } = render(
      <CustomerAddFormContainer onError={onErrorMock} onUpdate={onCreateMock} />
    );

    const nameField = await findByLabelText('entities.customer.name');
    fireEvent.change(nameField, { target: { value: customerMock.name } });
    const customerNumberField = await findByLabelText('entities.customer.customerNumber');
    fireEvent.change(customerNumberField, { target: { value: customerMock.customerNumber } });
    const contactNameField = await findByLabelText('entities.customer.contactName');
    fireEvent.change(contactNameField, { target: { value: customerMock.contactName } });
    const contactPhoneField = await findByLabelText('entities.customer.contactPhone');
    fireEvent.change(contactPhoneField, { target: { value: customerMock.contactPhone } });
    const contactEmailField = await findByLabelText('entities.customer.contactEmail');
    fireEvent.change(contactEmailField, { target: { value: customerMock.contactEmail } });
    const notesField = await findByLabelText('entities.customer.notes');
    fireEvent.change(notesField, { target: { value: customerMock.notes } });
    rerender(<CustomerAddFormContainer onError={onErrorMock} onUpdate={onCreateMock} />);

    const saveButton = await findByTestId('submit-btn');

    fireEvent.click(saveButton);

    await wait(() => {
      expect(apiCustomerPost).toHaveBeenCalledTimes(1);
      expect(apiCustomerPost).toHaveBeenCalledWith('', customerMock);

      expect(queryByText(successMessageKey)).not.toBeInTheDocument();

      expect(onErrorMock).toHaveBeenCalledTimes(1);
      expect(queryByText(errorMessageKey)).toBeInTheDocument();
    });
  }, 7000);
});
