import React, { Component } from 'react';
import i18n from '../../i18n';
import { ModalWrapper, Form, TextInput, TextArea, Select, SelectItem, DatePicker, DatePickerInput} from 'carbon-components-react';
import withKeycloak from '../../auth/withKeycloak';
import { apiProjectSubscriptionPut } from '../../api/subscriptions';

class EditSubscriptionModal extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            level: '',
            status: '',
            lengthInMonths: '',
            startDate: '',
            notes: '',
        };
    }

    handleChanges = e => {
        const input = e.target;
        const name = input.name;
        const value = input.value;
        this.setState({ [name]: value });
    };

    handleFormSubmit = (e) => {
        //e.preventDefault();
        console.log(this.props.subscription.id)
        const subscription = {
            id: this.props.subscription.id,
            level: this.state.level,
            status: this.state.status,
            lengthInMonths: this.state.lengthInMonths,
            startDate: this.state.startDate,
            notes: this.state.notes,
        }
        this.subscriptionPut(subscription);
    };

    isValid() {
        if (this.state.customerName === '') {
          return false;
        }
        return true;
    }

    componentDidMount() {
        this.setState({
            level: this.props.subscription.level,
            status: this.props.subscription.status,
            lengthInMonths: this.props.subscription.lengthInMonths,
            startDate: this.props.subscription.startDate,
            notes: this.props.subscription.notes,
          })
    }

    async subscriptionPut(subscription) {
        const { t, keycloak } = this.props;
        const authenticated = keycloak.initialized && keycloak.authenticated;
        if (authenticated) {
            const result = await apiProjectSubscriptionPut(this.props.serviceUrl, subscription);
        }
    }
    
    render() {
        const levelList = ['GOLD', 'PLATINUM'];
        const statusList = ['NEW', 'ACTIVE', 'EXPIRED'];
        return (
            <ModalWrapper
                buttonTriggerText={i18n.t('buttons.edit')}
                modalHeading={i18n.t('editSubscription.title')}
                buttonTriggerClassName="add-project bx--btn bx--btn--tertiary"
                className="modal-form"
                handleSubmit={this.handleFormSubmit}
            >
                <p> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse cursus fermentum risus, sit amet fringilla nunc pellentesque quis. </p>
                <div className="form-container">
                    <Form onSubmit={this.handleFormSubmit}>
                        <Select
                            name="level"
                            labelText="Level"
                            value={this.state.level}
                            onChange={this.handleChanges}
                            >
                            <SelectItem text="Select Level" value="level" />
                            {levelList.map((level, i) => (
                                    <SelectItem key={i} text={level} value={level}>
                                        {level}
                                    </SelectItem>
                            ))}
                        </Select>
                        <Select
                            name="status"
                            labelText="status"
                            value={this.state.status}
                            onChange={this.handleChanges}
                            >
                            <SelectItem text="Select Status" value="status" />
                            {statusList.map((status, i) => (
                                <SelectItem key={i} text={status} value={status}>
                                    {status}
                                </SelectItem>
                            ))}
                        </Select>
                        <DatePicker dateFormat="m/d/Y" datePickerType="simple">
                            <DatePickerInput
                                name="startDate"
                                placeholder="mm/dd/yyyy"
                                labelText="Start Date"
                                value={this.state.startDate}
                                onChange={ this.handleChanges}
                                type="text"
                                required
                            />
                        </DatePicker>
                        <TextInput name="lengthInMonths" labelText="Length In Months" value={this.state.lengthInMonths} onChange={this.handleChanges} />
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


