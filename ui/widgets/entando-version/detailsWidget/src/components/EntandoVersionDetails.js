import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import Box from '@material-ui/core/Box';

import entandoVersionType from 'components/__types__/entandoVersion';
import EntandoVersionFieldTable from 'components/entando-version-field-table/EntandoVersionFieldTable';

const EntandoVersionDetails = ({ t, entandoVersion }) => {
  return (
    <Box>
      <h3>
        {t('common.widgetName', {
          widgetNamePlaceholder: 'Entando Version',
        })}
      </h3>
      <EntandoVersionFieldTable entandoVersion={entandoVersion} />
    </Box>
  );
};

EntandoVersionDetails.propTypes = {
  entandoVersion: entandoVersionType,
  t: PropTypes.func.isRequired,
};

EntandoVersionDetails.defaultProps = {
  entandoVersion: {},
};

export default withTranslation()(EntandoVersionDetails);
