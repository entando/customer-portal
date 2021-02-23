import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import Box from '@material-ui/core/Box';

import partnerType from 'components/__types__/partner';
import PartnerFieldTable from 'components/partner-field-table/PartnerFieldTable';

const PartnerDetails = ({ t, partner }) => {
  return (
    <Box>
      <h3>
        {t('common.widgetName', {
          widgetNamePlaceholder: 'Partner',
        })}
      </h3>
      <PartnerFieldTable partner={partner} />
    </Box>
  );
};

PartnerDetails.propTypes = {
  partner: partnerType,
  t: PropTypes.func.isRequired,
};

PartnerDetails.defaultProps = {
  partner: {},
};

export default withTranslation()(PartnerDetails);
