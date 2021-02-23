import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import customerType from 'components/__types__/customer';

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

const CustomerTable = ({ items, onSelect, classes, t, Actions }) => {
  const tableRows = items.map(item => (
    <TableRow hover className={classes.rowRoot} key={item.id} onClick={() => onSelect(item)}>
      <TableCell>
        <span>{item.name}</span>
      </TableCell>
      <TableCell>
        <span>{item.customerNumber}</span>
      </TableCell>
      <TableCell>
        <span>{item.contactName}</span>
      </TableCell>
      <TableCell>
        <span>{item.contactPhone}</span>
      </TableCell>
      <TableCell>
        <span>{item.contactEmail}</span>
      </TableCell>
      <TableCell>
        <span>{item.notes}</span>
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
            <span>{t('entities.customer.name')}</span>
          </TableCell>
          <TableCell>
            <span>{t('entities.customer.customerNumber')}</span>
          </TableCell>
          <TableCell>
            <span>{t('entities.customer.contactName')}</span>
          </TableCell>
          <TableCell>
            <span>{t('entities.customer.contactPhone')}</span>
          </TableCell>
          <TableCell>
            <span>{t('entities.customer.contactEmail')}</span>
          </TableCell>
          <TableCell>
            <span>{t('entities.customer.notes')}</span>
          </TableCell>
          {Actions && <TableCell />}
        </TableRow>
      </TableHead>
      <TableBody>{tableRows}</TableBody>
    </Table>
  ) : (
    <div className={classes.noItems}>{t('entities.customer.noItems')}</div>
  );
};

CustomerTable.propTypes = {
  items: PropTypes.arrayOf(customerType).isRequired,
  onSelect: PropTypes.func,
  classes: PropTypes.shape({
    rowRoot: PropTypes.string,
    tableRoot: PropTypes.string,
    noItems: PropTypes.string,
  }).isRequired,
  t: PropTypes.func.isRequired,
  Actions: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
};

CustomerTable.defaultProps = {
  onSelect: () => {},
  Actions: null,
};

export default withStyles(styles)(withTranslation()(CustomerTable));
