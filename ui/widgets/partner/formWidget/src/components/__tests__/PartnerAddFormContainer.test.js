import React from 'react';
import { fireEvent, render, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { apiPartnerPost } from 'api/partners';
import PartnerAddFormContainer from 'components/PartnerAddFormContainer';
import 'i18n/__mocks__/i18nMock';
import partnerMock from 'components/__mocks__/partnerMocks';

jest.mock('api/partners');
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

describe('PartnerAddFormContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const errorMessageKey = 'error.dataLoading';
  const successMessageKey = 'common.dataSaved';

  const onErrorMock = jest.fn();
  const onCreateMock = jest.fn();

  it('saves data', async () => {
    apiPartnerPost.mockImplementation(data => Promise.resolve(data));

    const { findByTestId, findByLabelText, queryByText, rerender } = render(
      <PartnerAddFormContainer onError={onErrorMock} onUpdate={onCreateMock} />
    );

    const nameField = await findByLabelText('entities.partner.name');
    fireEvent.change(nameField, { target: { value: partnerMock.name } });
    const partnerNumberField = await findByLabelText('entities.partner.partnerNumber');
    fireEvent.change(partnerNumberField, { target: { value: partnerMock.partnerNumber } });
    const notesField = await findByLabelText('entities.partner.notes');
    fireEvent.change(notesField, { target: { value: partnerMock.notes } });
    rerender(<PartnerAddFormContainer onError={onErrorMock} onUpdate={onCreateMock} />);

    const saveButton = await findByTestId('submit-btn');

    fireEvent.click(saveButton);

    await wait(() => {
      expect(apiPartnerPost).toHaveBeenCalledTimes(1);
      expect(apiPartnerPost).toHaveBeenCalledWith('', partnerMock);

      expect(queryByText(successMessageKey)).toBeInTheDocument();

      expect(onErrorMock).toHaveBeenCalledTimes(0);
      expect(queryByText(errorMessageKey)).not.toBeInTheDocument();
    });
  }, 7000);

  it('shows an error if data is not successfully saved', async () => {
    apiPartnerPost.mockImplementation(() => Promise.reject());

    const { findByTestId, findByLabelText, queryByText, rerender } = render(
      <PartnerAddFormContainer onError={onErrorMock} onUpdate={onCreateMock} />
    );

    const nameField = await findByLabelText('entities.partner.name');
    fireEvent.change(nameField, { target: { value: partnerMock.name } });
    const partnerNumberField = await findByLabelText('entities.partner.partnerNumber');
    fireEvent.change(partnerNumberField, { target: { value: partnerMock.partnerNumber } });
    const notesField = await findByLabelText('entities.partner.notes');
    fireEvent.change(notesField, { target: { value: partnerMock.notes } });
    rerender(<PartnerAddFormContainer onError={onErrorMock} onUpdate={onCreateMock} />);

    const saveButton = await findByTestId('submit-btn');

    fireEvent.click(saveButton);

    await wait(() => {
      expect(apiPartnerPost).toHaveBeenCalledTimes(1);
      expect(apiPartnerPost).toHaveBeenCalledWith('', partnerMock);

      expect(queryByText(successMessageKey)).not.toBeInTheDocument();

      expect(onErrorMock).toHaveBeenCalledTimes(1);
      expect(queryByText(errorMessageKey)).toBeInTheDocument();
    });
  }, 7000);
});
