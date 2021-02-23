import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import projectType from 'components/__types__/project';

const ProjectFieldTable = ({ t, project }) => (
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
          <span>{t('entities.project.id')}</span>
        </TableCell>
        <TableCell>
          <span>{project.id}</span>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <span>{t('entities.project.name')}</span>
        </TableCell>
        <TableCell>
          <span>{project.name}</span>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <span>{t('entities.project.description')}</span>
        </TableCell>
        <TableCell>
          <span>{project.description}</span>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <span>{t('entities.project.systemId')}</span>
        </TableCell>
        <TableCell>
          <span>{project.systemId}</span>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <span>{t('entities.project.contactName')}</span>
        </TableCell>
        <TableCell>
          <span>{project.contactName}</span>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <span>{t('entities.project.contactPhone')}</span>
        </TableCell>
        <TableCell>
          <span>{project.contactPhone}</span>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <span>{t('entities.project.contactEmail')}</span>
        </TableCell>
        <TableCell>
          <span>{project.contactEmail}</span>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <span>{t('entities.project.notes')}</span>
        </TableCell>
        <TableCell>
          <span>{project.notes}</span>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
);

ProjectFieldTable.propTypes = {
  project: projectType,
  t: PropTypes.func.isRequired,
};

ProjectFieldTable.defaultProps = {
  project: [],
};

export default withTranslation()(ProjectFieldTable);
