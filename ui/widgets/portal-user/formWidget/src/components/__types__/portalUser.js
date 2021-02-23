import PropTypes from 'prop-types';

export default PropTypes.shape({
  id: PropTypes.number,

  username: PropTypes.string.isRequired,
  email: PropTypes.string,
});

export const formValues = PropTypes.shape({
  username: PropTypes.string,
  email: PropTypes.string,
});

export const formTouched = PropTypes.shape({
  username: PropTypes.oneOfType([PropTypes.bool, PropTypes.shape()]),
  email: PropTypes.oneOfType([PropTypes.bool, PropTypes.shape()]),
});

export const formErrors = PropTypes.shape({
  username: PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]),
  email: PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]),
});
