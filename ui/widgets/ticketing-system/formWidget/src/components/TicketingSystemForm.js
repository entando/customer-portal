import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { formValues, formTouched, formErrors } from 'components/__types__/ticketingSystem';
import { withFormik } from 'formik';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'recompose';
import * as Yup from 'yup';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import ConfirmationDialogTrigger from 'components/common/ConfirmationDialogTrigger';

const styles = theme => ({
  root: {
    margin: theme.spacing(3),
  },
  textField: {
    width: '100%',
  },
});
class TicketingSystemForm extends PureComponent {
  constructor(props) {
    super(props);
    this.handleConfirmationDialogAction = this.handleConfirmationDialogAction.bind(this);
  }

  handleConfirmationDialogAction(action) {
    const { onDelete, values } = this.props;
    switch (action) {
      case ConfirmationDialogTrigger.CONFIRM: {
        onDelete(values);
        break;
      }
      default:
        break;
    }
  }

  render() {
    const {
      classes,
      values,
      touched,
      errors,
      handleChange,
      handleBlur,
      handleSubmit: formikHandleSubmit,
      onDelete,
      onCancelEditing,
      isSubmitting,
      t,
    } = this.props;

    const getHelperText = field => (errors[field] && touched[field] ? errors[field] : '');

    const handleSubmit = e => {
      e.stopPropagation(); // avoids double submission caused by react-shadow-dom-retarget-events
      formikHandleSubmit(e);
    };

    return (
      <form onSubmit={handleSubmit} className={classes.root} data-testid="ticketingSystem-form">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              id="ticketingSystem-url"
              error={errors.url && touched.url}
              helperText={getHelperText('url')}
              className={classes.textField}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.url}
              name="url"
              label={t('entities.ticketingSystem.url')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="ticketingSystem-serviceAccount"
              error={errors.serviceAccount && touched.serviceAccount}
              helperText={getHelperText('serviceAccount')}
              className={classes.textField}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.serviceAccount}
              name="serviceAccount"
              label={t('entities.ticketingSystem.serviceAccount')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="ticketingSystem-serviceAccountSecret"
              error={errors.serviceAccountSecret && touched.serviceAccountSecret}
              helperText={getHelperText('serviceAccountSecret')}
              className={classes.textField}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.serviceAccountSecret}
              name="serviceAccountSecret"
              label={t('entities.ticketingSystem.serviceAccountSecret')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="ticketingSystem-systemId"
              error={errors.systemId && touched.systemId}
              helperText={getHelperText('systemId')}
              className={classes.textField}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.systemId}
              name="systemId"
              label={t('entities.ticketingSystem.systemId')}
            />
          </Grid>
          {onDelete && (
            <ConfirmationDialogTrigger
              onCloseDialog={this.handleConfirmationDialogAction}
              dialog={{
                title: t('entities.ticketingSystem.deleteDialog.title'),
                description: t('entities.ticketingSystem.deleteDialog.description'),
                confirmLabel: t('common.yes'),
                discardLabel: t('common.no'),
              }}
              Renderer={({ onClick }) => (
                <Button onClick={onClick} disabled={isSubmitting}>
                  {t('common.delete')}
                </Button>
              )}
            />
          )}

          <Button onClick={onCancelEditing} disabled={isSubmitting} data-testid="cancel-btn">
            {t('common.cancel')}
          </Button>

          <Button type="submit" color="primary" disabled={isSubmitting} data-testid="submit-btn">
            {t('common.save')}
          </Button>
        </Grid>
      </form>
    );
  }
}

TicketingSystemForm.propTypes = {
  classes: PropTypes.shape({
    root: PropTypes.string,
    textField: PropTypes.string,
    submitButton: PropTypes.string,
    button: PropTypes.string,
    downloadAnchor: PropTypes.string,
  }),
  values: formValues,
  touched: formTouched,
  errors: formErrors,
  handleChange: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  onCancelEditing: PropTypes.func,
  isSubmitting: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
  i18n: PropTypes.shape({ language: PropTypes.string }).isRequired,
};

TicketingSystemForm.defaultProps = {
  onCancelEditing: () => {},
  classes: {},
  values: {},
  touched: {},
  errors: {},
  onDelete: null,
};

const emptyTicketingSystem = {
  url: '',
  serviceAccount: '',
  serviceAccountSecret: '',
  systemId: '',
};

const validationSchema = Yup.object().shape({
  url: Yup.string().required(),
  serviceAccount: Yup.string().required(),
  serviceAccountSecret: Yup.string().required(),
  systemId: Yup.string(),
});

const formikBag = {
  mapPropsToValues: ({ ticketingSystem }) => ticketingSystem || emptyTicketingSystem,

  enableReinitialize: true,

  validationSchema,

  handleSubmit: (values, { setSubmitting, props: { onSubmit } }) => {
    onSubmit(values);
    setSubmitting(false);
  },

  displayName: 'TicketingSystemForm',
};

export default compose(
  withStyles(styles, { withTheme: true }),
  withTranslation(),
  withFormik(formikBag)
)(TicketingSystemForm);
