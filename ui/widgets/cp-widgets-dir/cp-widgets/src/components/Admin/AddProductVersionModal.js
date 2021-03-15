import React, { Component } from 'react';
import i18n from '../../i18n';
import { ModalWrapper, Form, TextInput, DatePicker, DatePickerInput} from 'carbon-components-react';
import withKeycloak from '../../auth/withKeycloak';
import { apiProductVersionPost } from '../../api/productVersion';

class AddProductVersionModal extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            name: '',
            startDate: '',
            endDate: '',
        };
    }

    handleChanges = e => {
        const input = e.target;
        const name = input.name;
        const value = input.value;
        this.setState({ [name]: value });
    };

    handleFormSubmit = e => {
        //e.preventDefault();
        console.log('Name:', this.state.name);
        console.log('start:', this.state.startDate);
        console.log('end:', this.state.endDate);
        console.log(this.state);
        console.log(this.props.serviceUrl)
        const productVersion = apiProductVersionPost(this.props.serviceUrl, this.state);
        this.render();
    };

    isValid() {
        if (this.state.name === '') {
          return false;
        }
        return true;
    }
    
    render() {
        return (
            <ModalWrapper
                buttonTriggerText={i18n.t('buttons.addProductVersion')}
                modalHeading={i18n.t('adminDashboard.addProductVersion.title')}
                buttonTriggerClassName="add-product-version bx--btn bx--btn--tertiary"
                className="modal-form"
                handleSubmit={this.handleFormSubmit}
            >
                <div className="form-container">
                    <p> {i18n.t('adminDashboard.addProductVersion.desc')} </p>
                    <Form onSubmit={this.handleFormSubmit}>
                        <TextInput name="name" labelText={i18n.t('adminDashboard.addProductVersion.productVersion')} value={this.state.name} onChange={this.handleChanges}  errorMessage={this.isValid() ? '' : 'This field is required'}/>
                        <DatePicker dateFormat="m/d/Y" datePickerType="simple">
                            <DatePickerInput
                                name="startDate"
                                placeholder="mm/dd/yyyy"
                                labelText={i18n.t('adminDashboard.addProductVersion.productVersionStartDate')}
                                value={this.state.startDate}
                                onChange={this.handleChanges}
                                type="text"
                            />
                        </DatePicker>       
                        <DatePicker dateFormat="m/d/Y" datePickerType="simple">
                            <DatePickerInput
                                name="endDate"
                                placeholder="mm/dd/yyyy"
                                labelText={i18n.t('adminDashboard.addProductVersion.productVersionEndDate')}
                                value={this.state.endDate}
                                onChange={this.handleChanges}
                                type="text"
                            />
                        </DatePicker>                  
                    </Form>
                </div> 
            </ModalWrapper>
        )
    }
}


export default withKeycloak(AddProductVersionModal);


