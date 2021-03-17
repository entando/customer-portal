import React, { Component } from 'react';
import i18n from '../../i18n';
import { ModalWrapper, Form, TextInput, TextArea, Select, SelectItem, DatePicker, DatePickerInput} from 'carbon-components-react';
import withKeycloak from '../../auth/withKeycloak';
import { apiCustomersGet, apiAddProjectToCustomer } from '../../api/customers';
import { apiProjectPost, apiProjectsGet } from '../../api/projects';

export default class EditSubscriptionModal extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            description: '',
            commitment: '',
            type: '',
            quantityRequest: '',
            components: '',
            level: '',
            sartDate: '',
            endDate: '',
            License: ''
        };
    }

    handleChanges = e => {
        const input = e.target;
        const name = input.name;
        const value = input.value;
        this.setState({ [name]: value });
    };

    handleFormSubmit = e => {
        e.preventDefault();
    };

    isValid() {
        if (this.state.customerName === '') {
          return false;
        }
        return true;
    }
    
    render() {
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
                        <TextArea name="description" labelText="Description" required value={this.state.description} onChange={this.handleChanges}/>
                        <TextInput name="commitment" labelText="commitment" value={this.state.commitment} onChange={this.handleChanges} />
                        <TextInput name="type" labelText="Type" value='' onChange=''value={this.state.type} onChange={this.handleChanges} />
                        <TextInput name="quantityRequest" labelText="quantity Request" value={this.state.quantityRequest} onChange={this.handleChanges} />
                        <TextInput name="components" labelText="Components" value={this.state.components} onChange={this.handleChanges} />
                        <TextInput name="level" labelText="Level" value={this.state.level} onChange={this.handleChanges} />
                        
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

                        <DatePicker dateFormat="m/d/Y" datePickerType="simple">
                            <DatePickerInput
                                name="endDate"
                                placeholder="mm/dd/yyyy"
                                labelText="End Date"
                                value={this.state.endDate}
                                onChange={ this.handleChanges}
                                type="text"
                                required
                            />
                        </DatePicker>
                        <TextInput name="license" labelText="License" value={this.state.license} onChange={this.handleChanges} />
                    </Form>
                </div> 
            </ModalWrapper>
        )
    }
}


