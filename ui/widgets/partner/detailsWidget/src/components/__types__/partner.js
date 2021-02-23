import PropTypes from 'prop-types';

const partnerType = PropTypes.shape({
  id: PropTypes.number,

  name: PropTypes.string,
  partnerNumber: PropTypes.string,
  notes: PropTypes.string,
});

export default partnerType;
