import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { formValues, formTouched, formErrors } from 'components/__types__/project';
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
class ProjectForm extends PureComponent {
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
      <form onSubmit={handleSubmit} className={classes.root} data-testid="project-form">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              id="project-name"
              error={errors.name && touched.name}
              helperText={getHelperText('name')}
              className={classes.textField}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.name}
              name="name"
              label={t('entities.project.name')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="project-description"
              error={errors.description && touched.description}
              helperText={getHelperText('description')}
              className={classes.textField}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.description}
              name="description"
              label={t('entities.project.description')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="project-systemId"
              error={errors.systemId && touched.systemId}
              helperText={getHelperText('systemId')}
              className={classes.textField}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.systemId}
              name="systemId"
              label={t('entities.project.systemId')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="project-contactName"
              error={errors.contactName && touched.contactName}
              helperText={getHelperText('contactName')}
              className={classes.textField}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.contactName}
              name="contactName"
              label={t('entities.project.contactName')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="project-contactPhone"
              error={errors.contactPhone && touched.contactPhone}
              helperText={getHelperText('contactPhone')}
              className={classes.textField}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.contactPhone}
              name="contactPhone"
              label={t('entities.project.contactPhone')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="project-contactEmail"
              error={errors.contactEmail && touched.contactEmail}
              helperText={getHelperText('contactEmail')}
              className={classes.textField}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.contactEmail}
              name="contactEmail"
              label={t('entities.project.contactEmail')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="project-notes"
              error={errors.notes && touched.notes}
              helperText={getHelperText('notes')}
              className={classes.textField}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.notes}
              name="notes"
              label={t('entities.project.notes')}
            />
          </Grid>
          {onDelete && (
            <ConfirmationDialogTrigger
              onCloseDialog={this.handleConfirmationDialogAction}
              dialog={{
                title: t('entities.project.deleteDialog.title'),
                description: t('entities.project.deleteDialog.description'),
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

ProjectForm.propTypes = {
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

ProjectForm.defaultProps = {
  onCancelEditing: () => {},
  classes: {},
  values: {},
  touched: {},
  errors: {},
  onDelete: null,
};

const emptyProject = {
  name: '',
  description: '',
  systemId: '',
  contactName: '',
  contactPhone: '',
  contactEmail: '',
  notes: '',
};

const validationSchema = Yup.object().shape({
  name: Yup.string().required(),
  description: Yup.string().required(),
  systemId: Yup.string(),
  contactName: Yup.string(),
  contactPhone: Yup.string(),
  contactEmail: Yup.string(),
  notes: Yup.string().max(1024),
});

const formikBag = {
  mapPropsToValues: ({ project }) => project || emptyProject,

  enableReinitialize: true,

  validationSchema,

  handleSubmit: (values, { setSubmitting, props: { onSubmit } }) => {
    onSubmit(values);
    setSubmitting(false);
  },

  displayName: 'ProjectForm',
};

export default compose(
  withStyles(styles, { withTheme: true }),
  withTranslation(),
  withFormik(formikBag)
)(ProjectForm);
