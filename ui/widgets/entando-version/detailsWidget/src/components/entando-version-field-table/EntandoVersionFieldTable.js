import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import entandoVersionType from 'components/__types__/entandoVersion';

const EntandoVersionFieldTable = ({ t, entandoVersion }) => (
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
          <span>{t('entities.entandoVersion.id')}</span>
        </TableCell>
        <TableCell>
          <span>{entandoVersion.id}</span>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <span>{t('entities.entandoVersion.name')}</span>
        </TableCell>
        <TableCell>
          <span>{entandoVersion.name}</span>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
);

EntandoVersionFieldTable.propTypes = {
  entandoVersion: entandoVersionType,
  t: PropTypes.func.isRequired,
};

EntandoVersionFieldTable.defaultProps = {
  entandoVersion: [],
};

export default withTranslation()(EntandoVersionFieldTable);
