import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import Box from '@material-ui/core/Box';

import projectSubscriptionType from 'components/__types__/projectSubscription';
import ProjectSubscriptionFieldTable from 'components/project-subscription-field-table/ProjectSubscriptionFieldTable';

const ProjectSubscriptionDetails = ({ t, projectSubscription }) => {
  return (
    <Box>
      <h3>
        {t('common.widgetName', {
          widgetNamePlaceholder: 'Project Subscription',
        })}
      </h3>
      <ProjectSubscriptionFieldTable projectSubscription={projectSubscription} />
    </Box>
  );
};

ProjectSubscriptionDetails.propTypes = {
  projectSubscription: projectSubscriptionType,
  t: PropTypes.func.isRequired,
};

ProjectSubscriptionDetails.defaultProps = {
  projectSubscription: {},
};

export default withTranslation()(ProjectSubscriptionDetails);
