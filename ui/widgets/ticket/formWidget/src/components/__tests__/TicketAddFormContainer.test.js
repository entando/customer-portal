import React from 'react';
import { fireEvent, render, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { apiTicketPost } from 'api/tickets';
import TicketAddFormContainer from 'components/TicketAddFormContainer';
import 'i18n/__mocks__/i18nMock';
import ticketMock from 'components/__mocks__/ticketMocks';

jest.mock('api/tickets');
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

describe('TicketAddFormContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const errorMessageKey = 'error.dataLoading';
  const successMessageKey = 'common.dataSaved';

  const onErrorMock = jest.fn();
  const onCreateMock = jest.fn();

  it('saves data', async () => {
    apiTicketPost.mockImplementation(data => Promise.resolve(data));

    const { findByTestId, findByLabelText, queryByText, rerender } = render(
      <TicketAddFormContainer onError={onErrorMock} onUpdate={onCreateMock} />
    );

    const systemIdField = await findByLabelText('entities.ticket.systemId');
    fireEvent.change(systemIdField, { target: { value: ticketMock.systemId } });
    const typeField = await findByLabelText('entities.ticket.type');
    fireEvent.change(typeField, { target: { value: ticketMock.type } });
    const descriptionField = await findByLabelText('entities.ticket.description');
    fireEvent.change(descriptionField, { target: { value: ticketMock.description } });
    const priorityField = await findByLabelText('entities.ticket.priority');
    fireEvent.change(priorityField, { target: { value: ticketMock.priority } });
    const statusField = await findByLabelText('entities.ticket.status');
    fireEvent.change(statusField, { target: { value: ticketMock.status } });
    const createDateField = await findByLabelText('entities.ticket.createDate');
    fireEvent.change(createDateField, { target: { value: ticketMock.createDate } });
    const updateDateField = await findByLabelText('entities.ticket.updateDate');
    fireEvent.change(updateDateField, { target: { value: ticketMock.updateDate } });
    rerender(<TicketAddFormContainer onError={onErrorMock} onUpdate={onCreateMock} />);

    const saveButton = await findByTestId('submit-btn');

    fireEvent.click(saveButton);

    await wait(() => {
      expect(apiTicketPost).toHaveBeenCalledTimes(1);
      expect(apiTicketPost).toHaveBeenCalledWith('', ticketMock);

      expect(queryByText(successMessageKey)).toBeInTheDocument();

      expect(onErrorMock).toHaveBeenCalledTimes(0);
      expect(queryByText(errorMessageKey)).not.toBeInTheDocument();
    });
  }, 7000);

  it('shows an error if data is not successfully saved', async () => {
    apiTicketPost.mockImplementation(() => Promise.reject());

    const { findByTestId, findByLabelText, queryByText, rerender } = render(
      <TicketAddFormContainer onError={onErrorMock} onUpdate={onCreateMock} />
    );

    const systemIdField = await findByLabelText('entities.ticket.systemId');
    fireEvent.change(systemIdField, { target: { value: ticketMock.systemId } });
    const typeField = await findByLabelText('entities.ticket.type');
    fireEvent.change(typeField, { target: { value: ticketMock.type } });
    const descriptionField = await findByLabelText('entities.ticket.description');
    fireEvent.change(descriptionField, { target: { value: ticketMock.description } });
    const priorityField = await findByLabelText('entities.ticket.priority');
    fireEvent.change(priorityField, { target: { value: ticketMock.priority } });
    const statusField = await findByLabelText('entities.ticket.status');
    fireEvent.change(statusField, { target: { value: ticketMock.status } });
    const createDateField = await findByLabelText('entities.ticket.createDate');
    fireEvent.change(createDateField, { target: { value: ticketMock.createDate } });
    const updateDateField = await findByLabelText('entities.ticket.updateDate');
    fireEvent.change(updateDateField, { target: { value: ticketMock.updateDate } });
    rerender(<TicketAddFormContainer onError={onErrorMock} onUpdate={onCreateMock} />);

    const saveButton = await findByTestId('submit-btn');

    fireEvent.click(saveButton);

    await wait(() => {
      expect(apiTicketPost).toHaveBeenCalledTimes(1);
      expect(apiTicketPost).toHaveBeenCalledWith('', ticketMock);

      expect(queryByText(successMessageKey)).not.toBeInTheDocument();

      expect(onErrorMock).toHaveBeenCalledTimes(1);
      expect(queryByText(errorMessageKey)).toBeInTheDocument();
    });
  }, 7000);
});
