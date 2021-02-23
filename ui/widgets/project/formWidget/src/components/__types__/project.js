import PropTypes from 'prop-types';

export default PropTypes.shape({
  id: PropTypes.number,

  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  systemId: PropTypes.string,
  contactName: PropTypes.string,
  contactPhone: PropTypes.string,
  contactEmail: PropTypes.string,
  notes: PropTypes.string,
});

export const formValues = PropTypes.shape({
  name: PropTypes.string,
  description: PropTypes.string,
  systemId: PropTypes.string,
  contactName: PropTypes.string,
  contactPhone: PropTypes.string,
  contactEmail: PropTypes.string,
  notes: PropTypes.string,
});

export const formTouched = PropTypes.shape({
  name: PropTypes.oneOfType([PropTypes.bool, PropTypes.shape()]),
  description: PropTypes.oneOfType([PropTypes.bool, PropTypes.shape()]),
  systemId: PropTypes.oneOfType([PropTypes.bool, PropTypes.shape()]),
  contactName: PropTypes.oneOfType([PropTypes.bool, PropTypes.shape()]),
  contactPhone: PropTypes.oneOfType([PropTypes.bool, PropTypes.shape()]),
  contactEmail: PropTypes.oneOfType([PropTypes.bool, PropTypes.shape()]),
  notes: PropTypes.oneOfType([PropTypes.bool, PropTypes.shape()]),
});

export const formErrors = PropTypes.shape({
  name: PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]),
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]),
  systemId: PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]),
  contactName: PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]),
  contactPhone: PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]),
  contactEmail: PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]),
  notes: PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]),
});
