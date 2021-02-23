import PropTypes from 'prop-types';

export default PropTypes.shape({
  id: PropTypes.number,

  name: PropTypes.string.isRequired,
  partnerNumber: PropTypes.string.isRequired,
  notes: PropTypes.string,
});

export const formValues = PropTypes.shape({
  name: PropTypes.string,
  partnerNumber: PropTypes.string,
  notes: PropTypes.string,
});

export const formTouched = PropTypes.shape({
  name: PropTypes.oneOfType([PropTypes.bool, PropTypes.shape()]),
  partnerNumber: PropTypes.oneOfType([PropTypes.bool, PropTypes.shape()]),
  notes: PropTypes.oneOfType([PropTypes.bool, PropTypes.shape()]),
});

export const formErrors = PropTypes.shape({
  name: PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]),
  partnerNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]),
  notes: PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]),
});
