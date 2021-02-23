import PropTypes from 'prop-types';

export default PropTypes.shape({
  id: PropTypes.number,

  level: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  lengthInMonths: PropTypes.number,
  startDate: PropTypes.string,
  notes: PropTypes.string,
});

export const formValues = PropTypes.shape({
  level: PropTypes.string,
  status: PropTypes.string,
  lengthInMonths: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  startDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  notes: PropTypes.string,
});

export const formTouched = PropTypes.shape({
  level: PropTypes.oneOfType([PropTypes.bool, PropTypes.shape()]),
  status: PropTypes.oneOfType([PropTypes.bool, PropTypes.shape()]),
  lengthInMonths: PropTypes.oneOfType([PropTypes.bool, PropTypes.shape()]),
  startDate: PropTypes.oneOfType([PropTypes.bool, PropTypes.shape()]),
  notes: PropTypes.oneOfType([PropTypes.bool, PropTypes.shape()]),
});

export const formErrors = PropTypes.shape({
  level: PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]),
  status: PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]),
  lengthInMonths: PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]),
  startDate: PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]),
  notes: PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]),
});
