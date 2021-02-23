import PropTypes from 'prop-types';

const ticketType = PropTypes.shape({
  id: PropTypes.number,

  systemId: PropTypes.string,
  type: PropTypes.string,
  description: PropTypes.string,
  priority: PropTypes.string,
  status: PropTypes.string,
  createDate: PropTypes.string,
  updateDate: PropTypes.string,
});

export default ticketType;
