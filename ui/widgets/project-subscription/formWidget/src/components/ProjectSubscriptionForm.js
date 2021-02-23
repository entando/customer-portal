import 'date-fns';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { formValues, formTouched, formErrors } from 'components/__types__/projectSubscription';
import { withFormik } from 'formik';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'recompose';
import * as Yup from 'yup';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
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
class ProjectSubscriptionForm extends PureComponent {
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
        <form
          onSubmit={handleSubmit}
          className={classes.root}
          data-testid="projectSubscription-form"
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <InputLabel htmlFor="projectSubscription-level">
                {t('entities.projectSubscription.level')}
              </InputLabel>
              <Select
                native
                id="projectSubscription-level"
                error={errors.level && touched.level}
                className={classes.textField}
                value={values.level}
                name="level"
                onChange={handleChange}
              >
                {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                <option value="" />
                <option value="GOLD">GOLD</option>
                <option value="PLATINUM">PLATINUM</option>
              </Select>
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel htmlFor="projectSubscription-status">
                {t('entities.projectSubscription.status')}
              </InputLabel>
              <Select
                native
                id="projectSubscription-status"
                error={errors.status && touched.status}
                className={classes.textField}
                value={values.status}
                name="status"
                onChange={handleChange}
              >
                {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                <option value="" />
                <option value="NEW">NEW</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="EXPIRED">EXPIRED</option>
              </Select>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="projectSubscription-lengthInMonths"
                error={errors.lengthInMonths && touched.lengthInMonths}
                helperText={getHelperText('lengthInMonths')}
                className={classes.textField}
                type="number"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.lengthInMonths}
                name="lengthInMonths"
                label={t('entities.projectSubscription.lengthInMonths')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DateTimePicker
                id="projectSubscription-startDate"
                error={errors.startDate && touched.startDate}
                helperText={getHelperText('startDate')}
                className={classes.textField}
                onChange={handleDateChange('startDate')}
                value={values.startDate}
                labelFunc={dateTimeLabelFn}
                name="startDate"
                label={t('entities.projectSubscription.startDate')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="projectSubscription-notes"
                error={errors.notes && touched.notes}
                helperText={getHelperText('notes')}
                className={classes.textField}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.notes}
                name="notes"
                label={t('entities.projectSubscription.notes')}
              />
            </Grid>
            {onDelete && (
              <ConfirmationDialogTrigger
                onCloseDialog={this.handleConfirmationDialogAction}
                dialog={{
                  title: t('entities.projectSubscription.deleteDialog.title'),
                  description: t('entities.projectSubscription.deleteDialog.description'),
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

ProjectSubscriptionForm.propTypes = {
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

ProjectSubscriptionForm.defaultProps = {
  onCancelEditing: () => {},
  classes: {},
  values: {},
  touched: {},
  errors: {},
  onDelete: null,
};

const emptyProjectSubscription = {
  level: '',
  status: '',
  lengthInMonths: '',
  startDate: null,
  notes: '',
};

const validationSchema = Yup.object().shape({
  level: Yup.string().required(),
  status: Yup.string().required(),
  lengthInMonths: Yup.number(),
  startDate: Yup.date().nullable(),
  notes: Yup.string().max(1024),
});

const formikBag = {
  mapPropsToValues: ({ projectSubscription }) => projectSubscription || emptyProjectSubscription,

  enableReinitialize: true,

  validationSchema,

  handleSubmit: (values, { setSubmitting, props: { onSubmit } }) => {
    onSubmit(values);
    setSubmitting(false);
  },

  displayName: 'ProjectSubscriptionForm',
};

export default compose(
  withStyles(styles, { withTheme: true }),
  withTranslation(),
  withFormik(formikBag)
)(ProjectSubscriptionForm);
