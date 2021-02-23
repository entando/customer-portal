import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import portalUserType from 'components/__types__/portalUser';

const PortalUserFieldTable = ({ t, portalUser }) => (
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
          <span>{t('entities.portalUser.id')}</span>
        </TableCell>
        <TableCell>
          <span>{portalUser.id}</span>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <span>{t('entities.portalUser.username')}</span>
        </TableCell>
        <TableCell>
          <span>{portalUser.username}</span>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <span>{t('entities.portalUser.email')}</span>
        </TableCell>
        <TableCell>
          <span>{portalUser.email}</span>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
);

PortalUserFieldTable.propTypes = {
  portalUser: portalUserType,
  t: PropTypes.func.isRequired,
};

PortalUserFieldTable.defaultProps = {
  portalUser: [],
};

export default withTranslation()(PortalUserFieldTable);
