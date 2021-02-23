import React from 'react';
import { fireEvent, render, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { apiTicketingSystemPost } from 'api/ticketingSystems';
import TicketingSystemAddFormContainer from 'components/TicketingSystemAddFormContainer';
import 'i18n/__mocks__/i18nMock';
import ticketingSystemMock from 'components/__mocks__/ticketingSystemMocks';

jest.mock('api/ticketingSystems');
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

describe('TicketingSystemAddFormContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const errorMessageKey = 'error.dataLoading';
  const successMessageKey = 'common.dataSaved';

  const onErrorMock = jest.fn();
  const onCreateMock = jest.fn();

  it('saves data', async () => {
    apiTicketingSystemPost.mockImplementation(data => Promise.resolve(data));

    const { findByTestId, findByLabelText, queryByText, rerender } = render(
      <TicketingSystemAddFormContainer onError={onErrorMock} onUpdate={onCreateMock} />
    );

    const urlField = await findByLabelText('entities.ticketingSystem.url');
    fireEvent.change(urlField, { target: { value: ticketingSystemMock.url } });
    const serviceAccountField = await findByLabelText('entities.ticketingSystem.serviceAccount');
    fireEvent.change(serviceAccountField, {
      target: { value: ticketingSystemMock.serviceAccount },
    });
    const serviceAccountSecretField = await findByLabelText(
      'entities.ticketingSystem.serviceAccountSecret'
    );
    fireEvent.change(serviceAccountSecretField, {
      target: { value: ticketingSystemMock.serviceAccountSecret },
    });
    const systemIdField = await findByLabelText('entities.ticketingSystem.systemId');
    fireEvent.change(systemIdField, { target: { value: ticketingSystemMock.systemId } });
    rerender(<TicketingSystemAddFormContainer onError={onErrorMock} onUpdate={onCreateMock} />);

    const saveButton = await findByTestId('submit-btn');

    fireEvent.click(saveButton);

    await wait(() => {
      expect(apiTicketingSystemPost).toHaveBeenCalledTimes(1);
      expect(apiTicketingSystemPost).toHaveBeenCalledWith('', ticketingSystemMock);

      expect(queryByText(successMessageKey)).toBeInTheDocument();

      expect(onErrorMock).toHaveBeenCalledTimes(0);
      expect(queryByText(errorMessageKey)).not.toBeInTheDocument();
    });
  }, 7000);

  it('shows an error if data is not successfully saved', async () => {
    apiTicketingSystemPost.mockImplementation(() => Promise.reject());

    const { findByTestId, findByLabelText, queryByText, rerender } = render(
      <TicketingSystemAddFormContainer onError={onErrorMock} onUpdate={onCreateMock} />
    );

    const urlField = await findByLabelText('entities.ticketingSystem.url');
    fireEvent.change(urlField, { target: { value: ticketingSystemMock.url } });
    const serviceAccountField = await findByLabelText('entities.ticketingSystem.serviceAccount');
    fireEvent.change(serviceAccountField, {
      target: { value: ticketingSystemMock.serviceAccount },
    });
    const serviceAccountSecretField = await findByLabelText(
      'entities.ticketingSystem.serviceAccountSecret'
    );
    fireEvent.change(serviceAccountSecretField, {
      target: { value: ticketingSystemMock.serviceAccountSecret },
    });
    const systemIdField = await findByLabelText('entities.ticketingSystem.systemId');
    fireEvent.change(systemIdField, { target: { value: ticketingSystemMock.systemId } });
    rerender(<TicketingSystemAddFormContainer onError={onErrorMock} onUpdate={onCreateMock} />);

    const saveButton = await findByTestId('submit-btn');

    fireEvent.click(saveButton);

    await wait(() => {
      expect(apiTicketingSystemPost).toHaveBeenCalledTimes(1);
      expect(apiTicketingSystemPost).toHaveBeenCalledWith('', ticketingSystemMock);

      expect(queryByText(successMessageKey)).not.toBeInTheDocument();

      expect(onErrorMock).toHaveBeenCalledTimes(1);
      expect(queryByText(errorMessageKey)).toBeInTheDocument();
    });
  }, 7000);
});
