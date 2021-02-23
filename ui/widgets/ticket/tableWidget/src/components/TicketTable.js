import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import ticketType from 'components/__types__/ticket';

const styles = {
  tableRoot: {
    marginTop: '10px',
  },
  rowRoot: {
    cursor: 'pointer',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  noItems: {
    margin: '15px',
  },
};

const TicketTable = ({ items, onSelect, classes, t, i18n, Actions }) => {
  const tableRows = items.map(item => (
    <TableRow hover className={classes.rowRoot} key={item.id} onClick={() => onSelect(item)}>
      <TableCell>
        <span>{item.systemId}</span>
      </TableCell>
      <TableCell>
        <span>{item.type}</span>
      </TableCell>
      <TableCell>
        <span>{item.description}</span>
      </TableCell>
      <TableCell>
        <span>{item.priority}</span>
      </TableCell>
      <TableCell>
        <span>{item.status}</span>
      </TableCell>
      <TableCell>
        <span>{new Date(item.createDate).toLocaleString(i18n.language)}</span>
      </TableCell>
      <TableCell>
        <span>{new Date(item.updateDate).toLocaleString(i18n.language)}</span>
      </TableCell>
      {Actions && (
        <TableCell>
          <Actions item={item} />
        </TableCell>
      )}
    </TableRow>
  ));

  return items.length ? (
    <Table className={classes.tableRoot} stickyHeader>
      <TableHead>
        <TableRow>
          <TableCell>
            <span>{t('entities.ticket.systemId')}</span>
          </TableCell>
          <TableCell>
            <span>{t('entities.ticket.type')}</span>
          </TableCell>
          <TableCell>
            <span>{t('entities.ticket.description')}</span>
          </TableCell>
          <TableCell>
            <span>{t('entities.ticket.priority')}</span>
          </TableCell>
          <TableCell>
            <span>{t('entities.ticket.status')}</span>
          </TableCell>
          <TableCell>
            <span>{t('entities.ticket.createDate')}</span>
          </TableCell>
          <TableCell>
            <span>{t('entities.ticket.updateDate')}</span>
          </TableCell>
          {Actions && <TableCell />}
        </TableRow>
      </TableHead>
      <TableBody>{tableRows}</TableBody>
    </Table>
  ) : (
    <div className={classes.noItems}>{t('entities.ticket.noItems')}</div>
  );
};

TicketTable.propTypes = {
  items: PropTypes.arrayOf(ticketType).isRequired,
  onSelect: PropTypes.func,
  classes: PropTypes.shape({
    rowRoot: PropTypes.string,
    tableRoot: PropTypes.string,
    noItems: PropTypes.string,
  }).isRequired,
  t: PropTypes.func.isRequired,
  i18n: PropTypes.shape({ language: PropTypes.string }).isRequired,
  Actions: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
};

TicketTable.defaultProps = {
  onSelect: () => {},
  Actions: null,
};

export default withStyles(styles)(withTranslation()(TicketTable));
