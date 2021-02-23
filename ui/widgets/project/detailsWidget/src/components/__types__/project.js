import PropTypes from 'prop-types';

const projectType = PropTypes.shape({
  id: PropTypes.number,

  name: PropTypes.string,
  description: PropTypes.string,
  systemId: PropTypes.string,
  contactName: PropTypes.string,
  contactPhone: PropTypes.string,
  contactEmail: PropTypes.string,
  notes: PropTypes.string,
});

export default projectType;
