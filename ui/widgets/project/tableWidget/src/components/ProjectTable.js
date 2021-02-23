import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import projectType from 'components/__types__/project';

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

const ProjectTable = ({ items, onSelect, classes, t, Actions }) => {
  const tableRows = items.map(item => (
    <TableRow hover className={classes.rowRoot} key={item.id} onClick={() => onSelect(item)}>
      <TableCell>
        <span>{item.name}</span>
      </TableCell>
      <TableCell>
        <span>{item.description}</span>
      </TableCell>
      <TableCell>
        <span>{item.systemId}</span>
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
            <span>{t('entities.project.name')}</span>
          </TableCell>
          <TableCell>
            <span>{t('entities.project.description')}</span>
          </TableCell>
          <TableCell>
            <span>{t('entities.project.systemId')}</span>
          </TableCell>
          <TableCell>
            <span>{t('entities.project.contactName')}</span>
          </TableCell>
          <TableCell>
            <span>{t('entities.project.contactPhone')}</span>
          </TableCell>
          <TableCell>
            <span>{t('entities.project.contactEmail')}</span>
          </TableCell>
          <TableCell>
            <span>{t('entities.project.notes')}</span>
          </TableCell>
          {Actions && <TableCell />}
        </TableRow>
      </TableHead>
      <TableBody>{tableRows}</TableBody>
    </Table>
  ) : (
    <div className={classes.noItems}>{t('entities.project.noItems')}</div>
  );
};

ProjectTable.propTypes = {
  items: PropTypes.arrayOf(projectType).isRequired,
  onSelect: PropTypes.func,
  classes: PropTypes.shape({
    rowRoot: PropTypes.string,
    tableRoot: PropTypes.string,
    noItems: PropTypes.string,
  }).isRequired,
  t: PropTypes.func.isRequired,
  Actions: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
};

ProjectTable.defaultProps = {
  onSelect: () => {},
  Actions: null,
};

export default withStyles(styles)(withTranslation()(ProjectTable));
