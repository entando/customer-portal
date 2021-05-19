import PropTypes from 'prop-types';

const customerType = PropTypes.shape({
  id: PropTypes.number,

  name: PropTypes.string,
  customerNumber: PropTypes.string,
  contactName: PropTypes.string,
  contactPhone: PropTypes.string,
  contactEmail: PropTypes.string,
  notes: PropTypes.string,
});

export default customerType;
