import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { formValues, formTouched, formErrors } from 'components/__types__/customer';
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
class CustomerForm extends PureComponent {
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
      <form onSubmit={handleSubmit} className={classes.root} data-testid="customer-form">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              id="customer-name"
              error={errors.name && touched.name}
              helperText={getHelperText('name')}
              className={classes.textField}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.name}
              name="name"
              label={t('entities.customer.name')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="customer-customerNumber"
              error={errors.customerNumber && touched.customerNumber}
              helperText={getHelperText('customerNumber')}
              className={classes.textField}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.customerNumber}
              name="customerNumber"
              label={t('entities.customer.customerNumber')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="customer-contactName"
              error={errors.contactName && touched.contactName}
              helperText={getHelperText('contactName')}
              className={classes.textField}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.contactName}
              name="contactName"
              label={t('entities.customer.contactName')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="customer-contactPhone"
              error={errors.contactPhone && touched.contactPhone}
              helperText={getHelperText('contactPhone')}
              className={classes.textField}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.contactPhone}
              name="contactPhone"
              label={t('entities.customer.contactPhone')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="customer-contactEmail"
              error={errors.contactEmail && touched.contactEmail}
              helperText={getHelperText('contactEmail')}
              className={classes.textField}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.contactEmail}
              name="contactEmail"
              label={t('entities.customer.contactEmail')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="customer-notes"
              error={errors.notes && touched.notes}
              helperText={getHelperText('notes')}
              className={classes.textField}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.notes}
              name="notes"
              label={t('entities.customer.notes')}
            />
          </Grid>
          {onDelete && (
            <ConfirmationDialogTrigger
              onCloseDialog={this.handleConfirmationDialogAction}
              dialog={{
                title: t('entities.customer.deleteDialog.title'),
                description: t('entities.customer.deleteDialog.description'),
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

CustomerForm.propTypes = {
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

CustomerForm.defaultProps = {
  onCancelEditing: () => {},
  classes: {},
  values: {},
  touched: {},
  errors: {},
  onDelete: null,
};

const emptyCustomer = {
  name: '',
  customerNumber: '',
  contactName: '',
  contactPhone: '',
  contactEmail: '',
  notes: '',
};

const validationSchema = Yup.object().shape({
  name: Yup.string().required(),
  customerNumber: Yup.string().required(),
  contactName: Yup.string(),
  contactPhone: Yup.string(),
  contactEmail: Yup.string(),
  notes: Yup.string().max(1024),
});

const formikBag = {
  mapPropsToValues: ({ customer }) => customer || emptyCustomer,

  enableReinitialize: true,

  validationSchema,

  handleSubmit: (values, { setSubmitting, props: { onSubmit } }) => {
    onSubmit(values);
    setSubmitting(false);
  },

  displayName: 'CustomerForm',
};

export default compose(
  withStyles(styles, { withTheme: true }),
  withTranslation(),
  withFormik(formikBag)
)(CustomerForm);
