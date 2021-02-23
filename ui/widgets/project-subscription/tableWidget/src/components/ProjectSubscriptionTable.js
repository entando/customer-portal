import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import projectSubscriptionType from 'components/__types__/projectSubscription';

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

const ProjectSubscriptionTable = ({ items, onSelect, classes, t, i18n, Actions }) => {
  const tableRows = items.map(item => (
    <TableRow hover className={classes.rowRoot} key={item.id} onClick={() => onSelect(item)}>
      <TableCell>
        <span>{item.level}</span>
      </TableCell>
      <TableCell>
        <span>{item.status}</span>
      </TableCell>
      <TableCell>
        <span>{item.lengthInMonths}</span>
      </TableCell>
      <TableCell>
        <span>{new Date(item.startDate).toLocaleString(i18n.language)}</span>
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
            <span>{t('entities.projectSubscription.level')}</span>
          </TableCell>
          <TableCell>
            <span>{t('entities.projectSubscription.status')}</span>
          </TableCell>
          <TableCell>
            <span>{t('entities.projectSubscription.lengthInMonths')}</span>
          </TableCell>
          <TableCell>
            <span>{t('entities.projectSubscription.startDate')}</span>
          </TableCell>
          <TableCell>
            <span>{t('entities.projectSubscription.notes')}</span>
          </TableCell>
          {Actions && <TableCell />}
        </TableRow>
      </TableHead>
      <TableBody>{tableRows}</TableBody>
    </Table>
  ) : (
    <div className={classes.noItems}>{t('entities.projectSubscription.noItems')}</div>
  );
};

ProjectSubscriptionTable.propTypes = {
  items: PropTypes.arrayOf(projectSubscriptionType).isRequired,
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

ProjectSubscriptionTable.defaultProps = {
  onSelect: () => {},
  Actions: null,
};

export default withStyles(styles)(withTranslation()(ProjectSubscriptionTable));
