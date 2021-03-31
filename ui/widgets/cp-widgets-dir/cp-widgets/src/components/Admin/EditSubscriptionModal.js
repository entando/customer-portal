import React, { Component } from 'react';
import i18n from '../../i18n';
import { ModalWrapper, Form, TextInput, TextArea, Select, SelectItem, DatePicker, DatePickerInput} from 'carbon-components-react';
import withKeycloak from '../../auth/withKeycloak';
import { apiProjectSubscriptionPut, apiSubscriptionGet } from '../../api/subscriptions';
import moment from 'moment';

class EditSubscriptionModal extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            level: '',
            status: '',
            lengthInMonths: '',
            startDate: '',
            notes: '',
            invalid: {},
            submitMsg: '',
            submitColour: 'black'
        };
    }

    handleValidation() {
        let invalid = {};
        let formIsValid = true;

        if (this.state.level === 'level') {
            formIsValid = false;
            invalid['level'] = true;
        }

        if (this.state.status === 'status') {
            formIsValid = false;
            invalid['status'] = true;
        }

        if (this.state.lengthInMonths === '' || !this.isNumeric(String(this.state.lengthInMonths))) {
            formIsValid = false;
            invalid['lengthInMonths'] = true;
        }

        if(typeof this.state.startDate !== "undefined"){
            if(!this.state.startDate.match(/^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/)){
              formIsValid = false;
              invalid['startDate'] = true;
            }      	
        }

        this.setState({ invalid: invalid });
        return formIsValid;
    }

    isNumeric(str) {
        if (typeof str != "string") 
            return false
        return !isNaN(str) && !isNaN(parseFloat(str))
    }

    handleChanges = e => {
        const input = e.target;
        const name = input.name;
        const value = input.value;
        this.setState({ [name]: value });
    };

    handleFormSubmit = (e) => {
        const formIsValid = this.handleValidation();

        if (formIsValid) {
            const subscriptionRequest = {
                projectSubscription : {
                    id: this.props.subscription.id,
                    level: this.state.level,
                    status: this.state.status,
                    lengthInMonths: this.state.lengthInMonths,
                    startDate: moment(this.state.startDate).format(),
                    notes: this.state.notes,
                    project: this.props.project,
                    entandoVersion: this.props.subscription.entandoVersion
                }
            }
            this.subscriptionPut(subscriptionRequest).then(result => {
                this.setState({
                    submitMsg: i18n.t('submitMessages.updated'),
                    submitColour: '#24a148'
                })
                this.props.updateSubscription();
            }).catch(err => {
                this.setState({
                    submitMsg: i18n.t('submitMessages.error'),
                    submitColour: '#da1e28'
                })
            });
        }
    };

    componentDidMount() {
        const { t, keycloak } = this.props;
        const authenticated = keycloak.initialized && keycloak.authenticated;
    
        if (authenticated) { 
            this.getSubscriptionDetails();

        }
    }

    handleStartDateChange = (date) => {
        this.setState({
            startDate: moment(date[0].toISOString()).format('MM/DD/YYYY')
        })
    }

    async getSubscriptionDetails() {
        const { t, keycloak } = this.props;
        const authenticated = keycloak.initialized && keycloak.authenticated;
        if (authenticated) {
            const subscription =  await apiSubscriptionGet(this.props.serviceUrl, this.props.subscription.id);
            this.setState({
                level: subscription.data.level,
                status: subscription.data.status,
                lengthInMonths: subscription.data.lengthInMonths,
                startDate: moment(this.props.subscription.startDate).format('MM/DD/YYYY'),
                notes: subscription.data.notes,
                submitMsg: ''
            })
        }
    }

    async subscriptionPut(subscription) {
        const { t, keycloak } = this.props;
        const authenticated = keycloak.initialized && keycloak.authenticated;
        if (authenticated) {
            return await apiProjectSubscriptionPut(this.props.serviceUrl, subscription);
        }
    }
    
    render() {
        const levelList = ['GOLD', 'PLATINUM'];
        const statusList = ['REQUESTED', 'PENDING', 'ACTIVE', 'EXPIRED'];
        return (
            <ModalWrapper
                buttonTriggerText={i18n.t('buttons.edit')}
                modalHeading={i18n.t('editSubscription.title')}
                buttonTriggerClassName="add-project bx--btn bx--btn--tertiary edit-sub-button"
                className="modal-form"
                id="modal-form-sub-edit"
                handleSubmit={this.handleFormSubmit}
                primaryButtonText={i18n.t('modalText.save')}
                secondaryButtonText={i18n.t('modalText.cancel')}
                modalLabel={<p style={{color: this.state.submitColour}}>{this.state.submitMsg}</p>}
            >
                {/*<p> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse cursus fermentum risus, sit amet fringilla nunc pellentesque quis. </p>*/}
                <div className="form-container">
                    <Form onSubmit={this.handleFormSubmit}>
                        <Select
                            name="level"
                            labelText={i18n.t('subscriptionDetails.level') + " *"}
                            value={this.state.level}
                            onChange={this.handleChanges}
                            invalidText={i18n.t('validation.invalid.required')}
                            invalid={this.state.invalid['level']} 
                            >
                            <SelectItem disabled text="Select Level" value="level" />
                            {levelList.map((level, i) => (
                                    <SelectItem key={i} text={level} value={level}>
                                        {level}
                                    </SelectItem>
                            ))}
                        </Select>
                        <Select
                            name="status"
                            labelText={i18n.t('subscriptionDetails.status') + " *"}
                            value={this.state.status}
                            onChange={this.handleChanges}
                            invalidText={i18n.t('validation.invalid.required')}
                            invalid={this.state.invalid['status']} 
                            >
                            <SelectItem disabled text="Select Status" value="status" />
                            {statusList.map((status, i) => (
                                <SelectItem key={i} text={status} value={status}>
                                    {status}
                                </SelectItem>
                            ))}
                        </Select>
                        <DatePicker dateFormat="m/d/Y" datePickerType="single" onChange={this.handleStartDateChange}>
                            <DatePickerInput
                                name="startDate"
                                placeholder="mm/dd/yyyy"
                                labelText={i18n.t('subscriptionDetails.startDate') + " *"}
                                value={this.state.startDate}
                                //onChange={this.handleChanges}
                                type="text"
                                invalidText={i18n.t('validation.invalid.date')} 
                                invalid={this.state.invalid['startDate']} 
                            />
                        </DatePicker>
                        <TextInput 
                            name="lengthInMonths" 
                            labelText={i18n.t('subscriptionDetails.lengthInMonths') + " *"} 
                            value={this.state.lengthInMonths} 
                            onChange={this.handleChanges} 
                            invalidText={i18n.t('validation.invalid.number')} 
                            invalid={this.state.invalid['lengthInMonths']} 
                        />
                        <TextArea 
                            name="notes" 
                            labelText={i18n.t('adminDashboard.addProject.notes')} 
                            value={this.state.notes} 
                            onChange={this.handleChanges} 
                        />
                    </Form>
                </div> 
            </ModalWrapper>
        )
    }
}

export default withKeycloak(EditSubscriptionModal)


