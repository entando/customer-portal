import React from 'react';
import { fireEvent, render, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { apiPortalUserPost } from 'api/portalUsers';
import PortalUserAddFormContainer from 'components/PortalUserAddFormContainer';
import 'i18n/__mocks__/i18nMock';
import portalUserMock from 'components/__mocks__/portalUserMocks';

jest.mock('api/portalUsers');
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

describe('PortalUserAddFormContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const errorMessageKey = 'error.dataLoading';
  const successMessageKey = 'common.dataSaved';

  const onErrorMock = jest.fn();
  const onCreateMock = jest.fn();

  it('saves data', async () => {
    apiPortalUserPost.mockImplementation(data => Promise.resolve(data));

    const { findByTestId, findByLabelText, queryByText, rerender } = render(
      <PortalUserAddFormContainer onError={onErrorMock} onUpdate={onCreateMock} />
    );

    const usernameField = await findByLabelText('entities.portalUser.username');
    fireEvent.change(usernameField, { target: { value: portalUserMock.username } });
    const emailField = await findByLabelText('entities.portalUser.email');
    fireEvent.change(emailField, { target: { value: portalUserMock.email } });
    rerender(<PortalUserAddFormContainer onError={onErrorMock} onUpdate={onCreateMock} />);

    const saveButton = await findByTestId('submit-btn');

    fireEvent.click(saveButton);

    await wait(() => {
      expect(apiPortalUserPost).toHaveBeenCalledTimes(1);
      expect(apiPortalUserPost).toHaveBeenCalledWith('', portalUserMock);

      expect(queryByText(successMessageKey)).toBeInTheDocument();

      expect(onErrorMock).toHaveBeenCalledTimes(0);
      expect(queryByText(errorMessageKey)).not.toBeInTheDocument();
    });
  }, 7000);

  it('shows an error if data is not successfully saved', async () => {
    apiPortalUserPost.mockImplementation(() => Promise.reject());

    const { findByTestId, findByLabelText, queryByText, rerender } = render(
      <PortalUserAddFormContainer onError={onErrorMock} onUpdate={onCreateMock} />
    );

    const usernameField = await findByLabelText('entities.portalUser.username');
    fireEvent.change(usernameField, { target: { value: portalUserMock.username } });
    const emailField = await findByLabelText('entities.portalUser.email');
    fireEvent.change(emailField, { target: { value: portalUserMock.email } });
    rerender(<PortalUserAddFormContainer onError={onErrorMock} onUpdate={onCreateMock} />);

    const saveButton = await findByTestId('submit-btn');

    fireEvent.click(saveButton);

    await wait(() => {
      expect(apiPortalUserPost).toHaveBeenCalledTimes(1);
      expect(apiPortalUserPost).toHaveBeenCalledWith('', portalUserMock);

      expect(queryByText(successMessageKey)).not.toBeInTheDocument();

      expect(onErrorMock).toHaveBeenCalledTimes(1);
      expect(queryByText(errorMessageKey)).toBeInTheDocument();
    });
  }, 7000);
});
