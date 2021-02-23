import PropTypes from 'prop-types';

const projectSubscriptionType = PropTypes.shape({
  id: PropTypes.number,

  level: PropTypes.string,
  status: PropTypes.string,
  lengthInMonths: PropTypes.number,
  startDate: PropTypes.string,
  notes: PropTypes.string,
});

export default projectSubscriptionType;
