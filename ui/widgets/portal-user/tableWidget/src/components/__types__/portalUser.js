import PropTypes from 'prop-types';

const portalUserType = PropTypes.shape({
  id: PropTypes.number,

  username: PropTypes.string,
  email: PropTypes.string,
});

export default portalUserType;
