import PropTypes from 'prop-types';

export default PropTypes.shape({
  id: PropTypes.number,

  url: PropTypes.string.isRequired,
  serviceAccount: PropTypes.string.isRequired,
  serviceAccountSecret: PropTypes.string.isRequired,
  systemId: PropTypes.string,
});

export const formValues = PropTypes.shape({
  url: PropTypes.string,
  serviceAccount: PropTypes.string,
  serviceAccountSecret: PropTypes.string,
  systemId: PropTypes.string,
});

export const formTouched = PropTypes.shape({
  url: PropTypes.oneOfType([PropTypes.bool, PropTypes.shape()]),
  serviceAccount: PropTypes.oneOfType([PropTypes.bool, PropTypes.shape()]),
  serviceAccountSecret: PropTypes.oneOfType([PropTypes.bool, PropTypes.shape()]),
  systemId: PropTypes.oneOfType([PropTypes.bool, PropTypes.shape()]),
});

export const formErrors = PropTypes.shape({
  url: PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]),
  serviceAccount: PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]),
  serviceAccountSecret: PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]),
  systemId: PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]),
});
