import React, {Component} from 'react';
import i18n from '../../i18n';
import {Form, TextInput, Select, SelectItem, Button, DatePicker, DatePickerInput} from 'carbon-components-react';
import withKeycloak from '../../auth/withKeycloak';
import {apiProjectGet} from '../../api/projects';
import {
  apiProjectSubscriptionPost,
  apiProjectSubscriptionPut,
  apiRenewSubscription,
  apiSubscriptionGet,
  stripTime,
} from '../../api/subscriptions';
import {apiProductVersionsGet} from '../../api/productVersion';
import {authenticationChanged, isAuthenticated, isPortalAdmin, isPortalUser} from '../../api/helpers';
import {apiAddSubscriptionToProject} from '../../api/projects';
import moment from 'moment';

const FORM_TYPE = {
  new: 'new',
  renewal: 'renewal',
  edit: 'edit',
};

const SUBSCRIPTION_LEVEL = {
  GOLD: 'GOLD',
  PLATINUM: 'PLATINUM',
};

const SUBSCRIPTION_STATUS = {
  requested: 'REQUESTED',
  pending: 'PENDING',
  active: 'ACTIVE',
  expired: 'EXPIRED',
};

class SubscriptionForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      project: {},
      projectId: '',
      subscription: {},
      startDate: '',
      level: 'PLATINUM',
      lengthInMonths: '',
      entandoVersionId: '',
      status: '',
      formType: 'new',
      invalid: {},
      productVersions: [],
      submitSuccess: false,
      submitError: false,
      submitColour: 'black',
    };
  }

  componentDidMount() {
    if (isAuthenticated(this.props)) {
      this.fetchData();
      this.setState({
        loading: false,
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (authenticationChanged(this.props, prevProps)) {
      this.fetchData();
      this.setState({
        loading: false,
      });
    }
  }

  async fetchData() {
    if (!isPortalUser()) {
      return;
    }

    const serviceUrl = this.props.serviceUrl;

    const search = window.location.search;
    const params = new URLSearchParams(search);

    const subscriptionId = params.get('subscription');
    let projectId = params.get('project');

    let subscription = {};
    let project = {};
    let formType = FORM_TYPE.new;
    let status = '';
    const isAdmin = isPortalAdmin();

    if (subscriptionId !== null) {
      subscription = (await apiSubscriptionGet(serviceUrl, subscriptionId)).data;
      status = isAdmin ? subscription.status : SUBSCRIPTION_STATUS.requested;
      formType = isAdmin ? FORM_TYPE.edit : FORM_TYPE.renewal;
      project = subscription.project;
    } else if (projectId !== null) {
      project = (await apiProjectGet(serviceUrl, projectId)).data;
      status = isAdmin ? SUBSCRIPTION_STATUS.pending : SUBSCRIPTION_STATUS.requested;
    } else {
      console.log('Unable to load project and/or subscription');
      return;
    }

    const productVersions = (await apiProductVersionsGet(serviceUrl)).data;

    this.setState({
      subscription: subscription,
      level: subscription.level ? subscription.level : '',
      entandoVersionId: subscription.entandoVersion ? subscription.entandoVersion.id : '',
      startDate: stripTime(subscription.startDate),
      lengthInMonths: subscription.lengthInMonths ? subscription.lengthInMonths : '',
      status: status,
      formType: formType,
      project: project,
      projectId: projectId,
      productVersions: productVersions,
    });
  }

  isNumeric(str) {
    return !isNaN(str) && !isNaN(parseInt(str));
  }

  handleValidation() {
    let invalid = {};

    if (!this.state.startDate || !this.state.startDate.match(/^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/)) {
      invalid['startDate'] = true;
    }

    if (!this.state.lengthInMonths || !this.isNumeric(this.state.lengthInMonths)) {
      invalid['lengthInMonths'] = true;
    }

    if (!this.state.level) {
      invalid['level'] = true;
    }

    if (this.state.entandoVersionId === '') {
      invalid['entandoVersionId'] = true;
    }

    this.setState({ invalid: invalid });
    return Object.keys(invalid).length === 0;
  }

  handleChanges = e => {
    const input = e.target;
    const name = input.name;
    const value = input.value;
    this.setState({ [name]: value });
    this.setState({
      submitSuccess: false,
      submitError: false,
    });
  };

  handleStartDateChange = date => {
    let formatted = '';
    if (date && date[0]) {
      formatted = moment(date[0].toISOString()).format('MM/DD/YYYY');
    }
    this.setState({
      startDate: formatted,
    });
  };

  updateStateForSuccess(success) {
    if (success) {
      this.setState({
        submitSuccess: true,
        submitError: false,
        submitColour: '#24a148',
      });
    } else {
      this.setState({
        submitSuccess: false,
        submitError: true,
        submitColour: '#da1e28',
      });
    }
  }

  handleFormSubmit = event => {
    event.preventDefault();
    this.setState({
      submitSuccess: false,
      submitError: false,
    });
    const formIsValid = this.handleValidation();

    if (formIsValid) {
      const formType = this.state.formType;
      const serviceUrl = this.props.serviceUrl;
      const subscriptionRequest = this.stateToSubscription();

      if (formType === FORM_TYPE.edit) {
        apiProjectSubscriptionPut(serviceUrl, subscriptionRequest)
          .then(() => {
            this.updateStateForSuccess(true);
          })
          .catch(() => {
            this.updateStateForSuccess(false);
          });
      } else if (formType === FORM_TYPE.new) {
        this.newSubscription(subscriptionRequest)
          .then(res => {
            apiAddSubscriptionToProject(serviceUrl, this.state.projectId, res.data.id);
            this.updateStateForSuccess(true);
          })
          .catch(() => {
            this.updateStateForSuccess(false);
          });
      } else if (formType === FORM_TYPE.renewal) {
        this.renewSubscription(subscriptionRequest)
          .then(res => {
            apiAddSubscriptionToProject(serviceUrl, this.state.projectId, res.data.id);
            this.updateStateForSuccess(true);
          })
          .catch(() => {
            this.updateStateForSuccess(false);
          });
      } else {
        console.log('Illegal operation');
      }
    }
  };

  stateToSubscription() {
    return {
      entandoVersionId: this.state.entandoVersionId,
      projectId: this.state.projectId,
      renewal: this.state.formType === FORM_TYPE.renewal,
      projectSubscription: {
        id: this.state.subscription.id,
        startDate: new Date(this.state.startDate),
        lengthInMonths: this.state.lengthInMonths,
        level: this.state.level,
        status: this.state.status.toUpperCase(),
      },
    };
  }

  async newSubscription(request) {
    return await apiProjectSubscriptionPost(this.props.serviceUrl, request);
  }

  async renewSubscription(request) {
    return await apiRenewSubscription(this.props.serviceUrl, request);
  }

  setupFormComponents() {
    const subscriptionLevelList = Object.entries(SUBSCRIPTION_LEVEL).map(([key, value]) => (
      <SelectItem key={key} text={value} value={key}>
        {value}
      </SelectItem>
    ));
    subscriptionLevelList.unshift(<SelectItem key="-1" text={i18n.t('subscriptionForm.chooseLevel')} value=""/>);

    const versionList = this.state.productVersions.map(version => {
      // only allow the user to choose from active entando versions
      if (version.status) {
        return (
          <SelectItem key={version.id} text={version.name} value={version.id}>
            {version.name}
          </SelectItem>
        );
      } else {
        return null;
      }
    });
    versionList.unshift(<SelectItem key="-1" text={i18n.t('subscriptionForm.chooseVersion')} value=""/>);

    const statusList = Object.entries(SUBSCRIPTION_STATUS).map(([key, value]) => (
      <SelectItem key={key} text={value} value={value}>
        {value}
      </SelectItem>
    ));

    return {subscriptionLevelList, versionList, statusList};
  }

  renderForm() {
    const {subscriptionLevelList, versionList, statusList} = this.setupFormComponents();
    return (
      <div>
        <div className="bx--row">
          <div className="bx--col">
            <div>
              <span>{i18n.t('subscriptionForm.projectName')}:</span> {this.state.project.name}
            </div>
            <Select
              id="status"
              name="status"
              labelText={i18n.t('subscriptionForm.subscriptionStatus')}
              value={this.state.status}
              onChange={this.handleChanges}
              invalidText={i18n.t('validation.invalid.required')}
              invalid={this.state.invalid['status']}
              disabled={!isPortalAdmin()}
            >
              {statusList}
            </Select>
            <Select
              id="level"
              name="level"
              labelText={i18n.t('subscriptionForm.subscriptionLevel') + ' *'}
              value={this.state.level || ''}
              onChange={this.handleChanges}
              invalidText={i18n.t('validation.invalid.required')}
              invalid={this.state.invalid['level']}
            >
              {subscriptionLevelList}
            </Select>
            <Select
              id="entandoVersionId"
              name="entandoVersionId"
              labelText={i18n.t('subscriptionForm.entandoVersion') + ' *'}
              value={this.state.entandoVersionId}
              onChange={this.handleChanges}
              invalidText={i18n.t('validation.invalid.required')}
              invalid={this.state.invalid['entandoVersionId']}
            >
              {versionList}
            </Select>
          </div>
          <div className="bx--col">
            <DatePicker dateFormat="m/d/Y" datePickerType="single" value={this.state.startDate}
                        onChange={this.handleStartDateChange}>
              <DatePickerInput
                id="startDate"
                name="startDate"
                placeholder="mm/dd/yyyy"
                labelText={i18n.t('subscriptionForm.subscriptionStartDate')}
                type="text"
                invalidText={i18n.t('validation.invalid.date')}
                invalid={this.state.invalid['startDate']}
              />
            </DatePicker>
            <TextInput
              id="lengthInMonths"
              name="lengthInMonths"
              labelText={i18n.t('subscriptionForm.subscriptionLength') + ' *'}
              value={this.state.lengthInMonths}
              onChange={this.handleChanges}
              invalidText={i18n.t('validation.invalid.number')}
              invalid={this.state.invalid['lengthInMonths']}
            />
          </div>
        </div>
      </div>
    );
  }

  successErrorMessage() {
    const isAdmin = isPortalAdmin();
    const { subscriptionType, submitSuccess, submitError } = this.state;

    if (subscriptionType === 'new') {
      if (submitSuccess) {
        return isAdmin ? this.createFormMessage('adminSubmitNewSuccess') : this.createFormMessage('customerSubmitSuccess');
      } else if (submitError) {
        return this.createFormMessage('newSubError');
      }
    } else {
      if (submitSuccess) {
        return isAdmin ? this.createFormMessage('adminRenewNewSuccess') : this.createFormMessage('customerSubmitSuccess');
      } else if (submitError) {
        return this.createFormMessage('renewSubError');
      }
    }
  }

  createFormMessage(subMessageKey) {
    return <p style={{ color: this.state.submitColour }}>{i18n.t(`subscriptionForm.${subMessageKey}`)}</p>;
  }

  render() {
    const titleKey = isPortalAdmin() ? 'subscriptionForm.adminTitle' : 'subscriptionForm.formTitle';
    const formType = this.state.formType;
    let formLabelKey = 'subscriptionForm.newSubscription';
    if (formType !== 'new') {
      formLabelKey = isPortalAdmin() ? 'subscriptionForm.editSubscription' : 'subscriptionForm.renewSubscription';
    }

    if (!this.state.loading) {
      if (isPortalUser()) {
        return (
          <div>
            <h3 className="pageTitle">{i18n.t(titleKey)}</h3>
            <div className="form-container">
              {this.successErrorMessage()}
              <Form onSubmit={this.handleFormSubmit}>
                <div className="bx--grid">
                  <div className="bx--row">
                    <div className="bx--col">
                      <strong>{i18n.t(formLabelKey)}</strong>
                    </div>
                  </div>
                  {this.renderForm()}
                  <Button kind="primary" tabIndex={0} type="submit">
                    {' '}
                    {i18n.t('buttons.submit')}
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        );
      } else {
        return <p>{i18n.t('userMessages.unauthorized')}</p>;
      }
    }
    // Loading
    else {
      return null;
    }
  }
}

export default withKeycloak(SubscriptionForm);
