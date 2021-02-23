import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import customerType from 'components/__types__/customer';

const CustomerFieldTable = ({ t, customer }) => (
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
          <span>{t('entities.customer.id')}</span>
        </TableCell>
        <TableCell>
          <span>{customer.id}</span>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <span>{t('entities.customer.name')}</span>
        </TableCell>
        <TableCell>
          <span>{customer.name}</span>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <span>{t('entities.customer.customerNumber')}</span>
        </TableCell>
        <TableCell>
          <span>{customer.customerNumber}</span>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <span>{t('entities.customer.contactName')}</span>
        </TableCell>
        <TableCell>
          <span>{customer.contactName}</span>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <span>{t('entities.customer.contactPhone')}</span>
        </TableCell>
        <TableCell>
          <span>{customer.contactPhone}</span>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <span>{t('entities.customer.contactEmail')}</span>
        </TableCell>
        <TableCell>
          <span>{customer.contactEmail}</span>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <span>{t('entities.customer.notes')}</span>
        </TableCell>
        <TableCell>
          <span>{customer.notes}</span>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
);

CustomerFieldTable.propTypes = {
  customer: customerType,
  t: PropTypes.func.isRequired,
};

CustomerFieldTable.defaultProps = {
  customer: [],
};

export default withTranslation()(CustomerFieldTable);
