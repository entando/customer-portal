import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import Box from '@material-ui/core/Box';

import portalUserType from 'components/__types__/portalUser';
import PortalUserFieldTable from 'components/portal-user-field-table/PortalUserFieldTable';

const PortalUserDetails = ({ t, portalUser }) => {
  return (
    <Box>
      <h3>
        {t('common.widgetName', {
          widgetNamePlaceholder: 'Portal User',
        })}
      </h3>
      <PortalUserFieldTable portalUser={portalUser} />
    </Box>
  );
};

PortalUserDetails.propTypes = {
  portalUser: portalUserType,
  t: PropTypes.func.isRequired,
};

PortalUserDetails.defaultProps = {
  portalUser: {},
};

export default withTranslation()(PortalUserDetails);
