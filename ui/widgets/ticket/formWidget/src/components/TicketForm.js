import 'date-fns';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { formValues, formTouched, formErrors } from 'components/__types__/ticket';
import { withFormik } from 'formik';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'recompose';
import * as Yup from 'yup';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import dateFnsLocales from 'i18n/dateFnsLocales';
import ConfirmationDialogTrigger from 'components/common/ConfirmationDialogTrigger';

const styles = theme => ({
  root: {
    margin: theme.spacing(3),
  },
  textField: {
    width: '100%',
  },
});
class TicketForm extends PureComponent {
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
      setFieldValue,
      t,
      i18n,
    } = this.props;

    const handleDateChange = field => value => {
      setFieldValue(field, value);
    };

    const dateTimeLabelFn = date => (date ? new Date(date).toLocaleString(i18n.language) : '');
    const getHelperText = field => (errors[field] && touched[field] ? errors[field] : '');

    const handleSubmit = e => {
      e.stopPropagation(); // avoids double submission caused by react-shadow-dom-retarget-events
      formikHandleSubmit(e);
    };

    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={dateFnsLocales[i18n.language]}>
        <form onSubmit={handleSubmit} className={classes.root} data-testid="ticket-form">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                id="ticket-systemId"
                error={errors.systemId && touched.systemId}
                helperText={getHelperText('systemId')}
                className={classes.textField}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.systemId}
                name="systemId"
                label={t('entities.ticket.systemId')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="ticket-type"
                error={errors.type && touched.type}
                helperText={getHelperText('type')}
                className={classes.textField}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.type}
                name="type"
                label={t('entities.ticket.type')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="ticket-description"
                error={errors.description && touched.description}
                helperText={getHelperText('description')}
                className={classes.textField}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.description}
                name="description"
                label={t('entities.ticket.description')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="ticket-priority"
                error={errors.priority && touched.priority}
                helperText={getHelperText('priority')}
                className={classes.textField}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.priority}
                name="priority"
                label={t('entities.ticket.priority')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="ticket-status"
                error={errors.status && touched.status}
                helperText={getHelperText('status')}
                className={classes.textField}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.status}
                name="status"
                label={t('entities.ticket.status')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DateTimePicker
                id="ticket-createDate"
                error={errors.createDate && touched.createDate}
                helperText={getHelperText('createDate')}
                className={classes.textField}
                onChange={handleDateChange('createDate')}
                value={values.createDate}
                labelFunc={dateTimeLabelFn}
                name="createDate"
                label={t('entities.ticket.createDate')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DateTimePicker
                id="ticket-updateDate"
                error={errors.updateDate && touched.updateDate}
                helperText={getHelperText('updateDate')}
                className={classes.textField}
                onChange={handleDateChange('updateDate')}
                value={values.updateDate}
                labelFunc={dateTimeLabelFn}
                name="updateDate"
                label={t('entities.ticket.updateDate')}
              />
            </Grid>
            {onDelete && (
              <ConfirmationDialogTrigger
                onCloseDialog={this.handleConfirmationDialogAction}
                dialog={{
                  title: t('entities.ticket.deleteDialog.title'),
                  description: t('entities.ticket.deleteDialog.description'),
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
      </MuiPickersUtilsProvider>
    );
  }
}

TicketForm.propTypes = {
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
  setFieldValue: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  i18n: PropTypes.shape({ language: PropTypes.string }).isRequired,
};

TicketForm.defaultProps = {
  onCancelEditing: () => {},
  classes: {},
  values: {},
  touched: {},
  errors: {},
  onDelete: null,
};

const emptyTicket = {
  systemId: '',
  type: '',
  description: '',
  priority: '',
  status: '',
  createDate: null,
  updateDate: null,
};

const validationSchema = Yup.object().shape({
  systemId: Yup.string().required(),
  type: Yup.string().required(),
  description: Yup.string().required(),
  priority: Yup.string(),
  status: Yup.string(),
  createDate: Yup.date()
    .nullable()
    .required(),
  updateDate: Yup.date()
    .nullable()
    .required(),
});

const formikBag = {
  mapPropsToValues: ({ ticket }) => ticket || emptyTicket,

  enableReinitialize: true,

  validationSchema,

  handleSubmit: (values, { setSubmitting, props: { onSubmit } }) => {
    onSubmit(values);
    setSubmitting(false);
  },

  displayName: 'TicketForm',
};

export default compose(
  withStyles(styles, { withTheme: true }),
  withTranslation(),
  withFormik(formikBag)
)(TicketForm);
