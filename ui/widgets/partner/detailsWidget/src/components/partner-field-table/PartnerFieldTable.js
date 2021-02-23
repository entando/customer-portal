import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import partnerType from 'components/__types__/partner';

const PartnerFieldTable = ({ t, partner }) => (
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
          <span>{t('entities.partner.id')}</span>
        </TableCell>
        <TableCell>
          <span>{partner.id}</span>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <span>{t('entities.partner.name')}</span>
        </TableCell>
        <TableCell>
          <span>{partner.name}</span>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <span>{t('entities.partner.partnerNumber')}</span>
        </TableCell>
        <TableCell>
          <span>{partner.partnerNumber}</span>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <span>{t('entities.partner.notes')}</span>
        </TableCell>
        <TableCell>
          <span>{partner.notes}</span>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
);

PartnerFieldTable.propTypes = {
  partner: partnerType,
  t: PropTypes.func.isRequired,
};

PartnerFieldTable.defaultProps = {
  partner: [],
};

export default withTranslation()(PartnerFieldTable);
