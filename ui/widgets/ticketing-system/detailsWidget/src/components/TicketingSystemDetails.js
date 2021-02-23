import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import Box from '@material-ui/core/Box';

import ticketingSystemType from 'components/__types__/ticketingSystem';
import TicketingSystemFieldTable from 'components/ticketing-system-field-table/TicketingSystemFieldTable';

const TicketingSystemDetails = ({ t, ticketingSystem }) => {
  return (
    <Box>
      <h3>
        {t('common.widgetName', {
          widgetNamePlaceholder: 'Ticketing System',
        })}
      </h3>
      <TicketingSystemFieldTable ticketingSystem={ticketingSystem} />
    </Box>
  );
};

TicketingSystemDetails.propTypes = {
  ticketingSystem: ticketingSystemType,
  t: PropTypes.func.isRequired,
};

TicketingSystemDetails.defaultProps = {
  ticketingSystem: {},
};

export default withTranslation()(TicketingSystemDetails);
