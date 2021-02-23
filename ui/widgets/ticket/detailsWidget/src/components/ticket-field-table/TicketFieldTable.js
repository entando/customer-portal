import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import ticketType from 'components/__types__/ticket';

const TicketFieldTable = ({ t, i18n: { language }, ticket }) => (
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
          <span>{t('entities.ticket.id')}</span>
        </TableCell>
        <TableCell>
          <span>{ticket.id}</span>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <span>{t('entities.ticket.systemId')}</span>
        </TableCell>
        <TableCell>
          <span>{ticket.systemId}</span>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <span>{t('entities.ticket.type')}</span>
        </TableCell>
        <TableCell>
          <span>{ticket.type}</span>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <span>{t('entities.ticket.description')}</span>
        </TableCell>
        <TableCell>
          <span>{ticket.description}</span>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <span>{t('entities.ticket.priority')}</span>
        </TableCell>
        <TableCell>
          <span>{ticket.priority}</span>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <span>{t('entities.ticket.status')}</span>
        </TableCell>
        <TableCell>
          <span>{ticket.status}</span>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <span>{t('entities.ticket.createDate')}</span>
        </TableCell>
        <TableCell>
          <span>{ticket.createDate && new Date(ticket.createDate).toLocaleString(language)}</span>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <span>{t('entities.ticket.updateDate')}</span>
        </TableCell>
        <TableCell>
          <span>{ticket.updateDate && new Date(ticket.updateDate).toLocaleString(language)}</span>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
);

TicketFieldTable.propTypes = {
  ticket: ticketType,
  t: PropTypes.func.isRequired,
  i18n: PropTypes.shape({
    language: PropTypes.string,
  }).isRequired,
};

TicketFieldTable.defaultProps = {
  ticket: [],
};

export default withTranslation()(TicketFieldTable);
