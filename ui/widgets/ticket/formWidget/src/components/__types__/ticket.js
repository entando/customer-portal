import PropTypes from 'prop-types';

export default PropTypes.shape({
  id: PropTypes.number,

  systemId: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  priority: PropTypes.string,
  status: PropTypes.string,
  createDate: PropTypes.string.isRequired,
  updateDate: PropTypes.string.isRequired,
});

export const formValues = PropTypes.shape({
  systemId: PropTypes.string,
  type: PropTypes.string,
  description: PropTypes.string,
  priority: PropTypes.string,
  status: PropTypes.string,
  createDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  updateDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
});

export const formTouched = PropTypes.shape({
  systemId: PropTypes.oneOfType([PropTypes.bool, PropTypes.shape()]),
  type: PropTypes.oneOfType([PropTypes.bool, PropTypes.shape()]),
  description: PropTypes.oneOfType([PropTypes.bool, PropTypes.shape()]),
  priority: PropTypes.oneOfType([PropTypes.bool, PropTypes.shape()]),
  status: PropTypes.oneOfType([PropTypes.bool, PropTypes.shape()]),
  createDate: PropTypes.oneOfType([PropTypes.bool, PropTypes.shape()]),
  updateDate: PropTypes.oneOfType([PropTypes.bool, PropTypes.shape()]),
});

export const formErrors = PropTypes.shape({
  systemId: PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]),
  type: PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]),
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]),
  priority: PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]),
  status: PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]),
  createDate: PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]),
  updateDate: PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]),
});
