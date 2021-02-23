import React from 'react';
import { fireEvent, render, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { apiProjectSubscriptionPost } from 'api/projectSubscriptions';
import ProjectSubscriptionAddFormContainer from 'components/ProjectSubscriptionAddFormContainer';
import 'i18n/__mocks__/i18nMock';
import projectSubscriptionMock from 'components/__mocks__/projectSubscriptionMocks';

jest.mock('api/projectSubscriptions');
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

describe('ProjectSubscriptionAddFormContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const errorMessageKey = 'error.dataLoading';
  const successMessageKey = 'common.dataSaved';

  const onErrorMock = jest.fn();
  const onCreateMock = jest.fn();

  it('saves data', async () => {
    apiProjectSubscriptionPost.mockImplementation(data => Promise.resolve(data));

    const { findByTestId, findByLabelText, queryByText, rerender } = render(
      <ProjectSubscriptionAddFormContainer onError={onErrorMock} onUpdate={onCreateMock} />
    );

    const levelField = await findByLabelText('entities.projectSubscription.level');
    fireEvent.change(levelField, { target: { value: projectSubscriptionMock.level } });
    const statusField = await findByLabelText('entities.projectSubscription.status');
    fireEvent.change(statusField, { target: { value: projectSubscriptionMock.status } });
    const lengthInMonthsField = await findByLabelText(
      'entities.projectSubscription.lengthInMonths'
    );
    fireEvent.change(lengthInMonthsField, {
      target: { value: projectSubscriptionMock.lengthInMonths },
    });
    const startDateField = await findByLabelText('entities.projectSubscription.startDate');
    fireEvent.change(startDateField, { target: { value: projectSubscriptionMock.startDate } });
    const notesField = await findByLabelText('entities.projectSubscription.notes');
    fireEvent.change(notesField, { target: { value: projectSubscriptionMock.notes } });
    rerender(<ProjectSubscriptionAddFormContainer onError={onErrorMock} onUpdate={onCreateMock} />);

    const saveButton = await findByTestId('submit-btn');

    fireEvent.click(saveButton);

    await wait(() => {
      expect(apiProjectSubscriptionPost).toHaveBeenCalledTimes(1);
      expect(apiProjectSubscriptionPost).toHaveBeenCalledWith('', projectSubscriptionMock);

      expect(queryByText(successMessageKey)).toBeInTheDocument();

      expect(onErrorMock).toHaveBeenCalledTimes(0);
      expect(queryByText(errorMessageKey)).not.toBeInTheDocument();
    });
  }, 7000);

  it('shows an error if data is not successfully saved', async () => {
    apiProjectSubscriptionPost.mockImplementation(() => Promise.reject());

    const { findByTestId, findByLabelText, queryByText, rerender } = render(
      <ProjectSubscriptionAddFormContainer onError={onErrorMock} onUpdate={onCreateMock} />
    );

    const levelField = await findByLabelText('entities.projectSubscription.level');
    fireEvent.change(levelField, { target: { value: projectSubscriptionMock.level } });
    const statusField = await findByLabelText('entities.projectSubscription.status');
    fireEvent.change(statusField, { target: { value: projectSubscriptionMock.status } });
    const lengthInMonthsField = await findByLabelText(
      'entities.projectSubscription.lengthInMonths'
    );
    fireEvent.change(lengthInMonthsField, {
      target: { value: projectSubscriptionMock.lengthInMonths },
    });
    const startDateField = await findByLabelText('entities.projectSubscription.startDate');
    fireEvent.change(startDateField, { target: { value: projectSubscriptionMock.startDate } });
    const notesField = await findByLabelText('entities.projectSubscription.notes');
    fireEvent.change(notesField, { target: { value: projectSubscriptionMock.notes } });
    rerender(<ProjectSubscriptionAddFormContainer onError={onErrorMock} onUpdate={onCreateMock} />);

    const saveButton = await findByTestId('submit-btn');

    fireEvent.click(saveButton);

    await wait(() => {
      expect(apiProjectSubscriptionPost).toHaveBeenCalledTimes(1);
      expect(apiProjectSubscriptionPost).toHaveBeenCalledWith('', projectSubscriptionMock);

      expect(queryByText(successMessageKey)).not.toBeInTheDocument();

      expect(onErrorMock).toHaveBeenCalledTimes(1);
      expect(queryByText(errorMessageKey)).toBeInTheDocument();
    });
  }, 7000);
});
