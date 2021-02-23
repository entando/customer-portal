import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import Box from '@material-ui/core/Box';

import customerType from 'components/__types__/customer';
import CustomerFieldTable from 'components/customer-field-table/CustomerFieldTable';

const CustomerDetails = ({ t, customer }) => {
  return (
    <Box>
      <h3>
        {t('common.widgetName', {
          widgetNamePlaceholder: 'Customer',
        })}
      </h3>
      <CustomerFieldTable customer={customer} />
    </Box>
  );
};

CustomerDetails.propTypes = {
  customer: customerType,
  t: PropTypes.func.isRequired,
};

CustomerDetails.defaultProps = {
  customer: {},
};

export default withTranslation()(CustomerDetails);
