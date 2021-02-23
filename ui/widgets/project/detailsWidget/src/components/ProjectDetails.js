import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import Box from '@material-ui/core/Box';

import projectType from 'components/__types__/project';
import ProjectFieldTable from 'components/project-field-table/ProjectFieldTable';

const ProjectDetails = ({ t, project }) => {
  return (
    <Box>
      <h3>
        {t('common.widgetName', {
          widgetNamePlaceholder: 'Project',
        })}
      </h3>
      <ProjectFieldTable project={project} />
    </Box>
  );
};

ProjectDetails.propTypes = {
  project: projectType,
  t: PropTypes.func.isRequired,
};

ProjectDetails.defaultProps = {
  project: {},
};

export default withTranslation()(ProjectDetails);
