import PropTypes from 'prop-types';

const ticketingSystemType = PropTypes.shape({
  id: PropTypes.number,

  url: PropTypes.string,
  serviceAccount: PropTypes.string,
  serviceAccountSecret: PropTypes.string,
  systemId: PropTypes.string,
});

export default ticketingSystemType;
