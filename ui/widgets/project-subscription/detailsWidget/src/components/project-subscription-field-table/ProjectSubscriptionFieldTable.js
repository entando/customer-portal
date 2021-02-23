import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import projectSubscriptionType from 'components/__types__/projectSubscription';

const ProjectSubscriptionFieldTable = ({ t, i18n: { language }, projectSubscription }) => (
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
          <span>{t('entities.projectSubscription.id')}</span>
        </TableCell>
        <TableCell>
          <span>{projectSubscription.id}</span>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <span>{t('entities.projectSubscription.level')}</span>
        </TableCell>
        <TableCell>
          <span>{projectSubscription.level}</span>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <span>{t('entities.projectSubscription.status')}</span>
        </TableCell>
        <TableCell>
          <span>{projectSubscription.status}</span>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <span>{t('entities.projectSubscription.lengthInMonths')}</span>
        </TableCell>
        <TableCell>
          <span>{projectSubscription.lengthInMonths}</span>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <span>{t('entities.projectSubscription.startDate')}</span>
        </TableCell>
        <TableCell>
          <span>
            {projectSubscription.startDate &&
              new Date(projectSubscription.startDate).toLocaleString(language)}
          </span>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <span>{t('entities.projectSubscription.notes')}</span>
        </TableCell>
        <TableCell>
          <span>{projectSubscription.notes}</span>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
);

ProjectSubscriptionFieldTable.propTypes = {
  projectSubscription: projectSubscriptionType,
  t: PropTypes.func.isRequired,
  i18n: PropTypes.shape({
    language: PropTypes.string,
  }).isRequired,
};

ProjectSubscriptionFieldTable.defaultProps = {
  projectSubscription: [],
};

export default withTranslation()(ProjectSubscriptionFieldTable);
