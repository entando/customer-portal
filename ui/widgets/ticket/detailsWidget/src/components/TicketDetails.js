import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import Box from '@material-ui/core/Box';

import ticketType from 'components/__types__/ticket';
import TicketFieldTable from 'components/ticket-field-table/TicketFieldTable';

const TicketDetails = ({ t, ticket }) => {
  return (
    <Box>
      <h3>
        {t('common.widgetName', {
          widgetNamePlaceholder: 'Ticket',
        })}
      </h3>
      <TicketFieldTable ticket={ticket} />
    </Box>
  );
};

TicketDetails.propTypes = {
  ticket: ticketType,
  t: PropTypes.func.isRequired,
};

TicketDetails.defaultProps = {
  ticket: {},
};

export default withTranslation()(TicketDetails);
