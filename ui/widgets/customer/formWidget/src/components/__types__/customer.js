import PropTypes from 'prop-types';

export default PropTypes.shape({
  id: PropTypes.number,

  name: PropTypes.string.isRequired,
  customerNumber: PropTypes.string.isRequired,
  contactName: PropTypes.string,
  contactPhone: PropTypes.string,
  contactEmail: PropTypes.string,
  notes: PropTypes.string,
});

export const formValues = PropTypes.shape({
  name: PropTypes.string,
  customerNumber: PropTypes.string,
  contactName: PropTypes.string,
  contactPhone: PropTypes.string,
  contactEmail: PropTypes.string,
  notes: PropTypes.string,
});

export const formTouched = PropTypes.shape({
  name: PropTypes.oneOfType([PropTypes.bool, PropTypes.shape()]),
  customerNumber: PropTypes.oneOfType([PropTypes.bool, PropTypes.shape()]),
  contactName: PropTypes.oneOfType([PropTypes.bool, PropTypes.shape()]),
  contactPhone: PropTypes.oneOfType([PropTypes.bool, PropTypes.shape()]),
  contactEmail: PropTypes.oneOfType([PropTypes.bool, PropTypes.shape()]),
  notes: PropTypes.oneOfType([PropTypes.bool, PropTypes.shape()]),
});

export const formErrors = PropTypes.shape({
  name: PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]),
  customerNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]),
  contactName: PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]),
  contactPhone: PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]),
  contactEmail: PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]),
  notes: PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]),
});
