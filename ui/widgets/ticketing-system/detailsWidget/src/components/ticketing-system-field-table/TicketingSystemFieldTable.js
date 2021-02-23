import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import ticketingSystemType from 'components/__types__/ticketingSystem';

const TicketingSystemFieldTable = ({ t, ticketingSystem }) => (
  <Table>
    <TableHead>
      <TableRow>
        <TableCell>{t('common.name')}</TableCell>
        <TableCell>{t('common.value')}</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      <TableRow>
        <TableCell>
          <span>{t('entities.ticketingSystem.id')}</span>
        </TableCell>
        <TableCell>
          <span>{ticketingSystem.id}</span>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <span>{t('entities.ticketingSystem.url')}</span>
        </TableCell>
        <TableCell>
          <span>{ticketingSystem.url}</span>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <span>{t('entities.ticketingSystem.serviceAccount')}</span>
        </TableCell>
        <TableCell>
          <span>{ticketingSystem.serviceAccount}</span>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <span>{t('entities.ticketingSystem.serviceAccountSecret')}</span>
        </TableCell>
        <TableCell>
          <span>{ticketingSystem.serviceAccountSecret}</span>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <span>{t('entities.ticketingSystem.systemId')}</span>
        </TableCell>
        <TableCell>
          <span>{ticketingSystem.systemId}</span>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
);

TicketingSystemFieldTable.propTypes = {
  ticketingSystem: ticketingSystemType,
  t: PropTypes.func.isRequired,
};

TicketingSystemFieldTable.defaultProps = {
  ticketingSystem: [],
};

export default withTranslation()(TicketingSystemFieldTable);
