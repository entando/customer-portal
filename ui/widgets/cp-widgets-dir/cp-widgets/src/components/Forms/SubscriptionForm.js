import React, { Component } from 'react';
import i18n from '../../i18n';
import { Form, TextInput, Select, SelectItem, Button, DatePicker, DatePickerInput} from 'carbon-components-react';

export default class SubscriptionForm extends Component {
    state = {
        customerNo: '',
        customerName: '',
        customerType: '',
        customerEmail: '',
        projectName: '',
        startDate: '',
        subscriptionLevel: '',
        subscriptionLength: '',
        contactName: '',
        contactEmail: '',
        contactNo: '',
        invalid: {}
    };

    handleValidation() {
        let invalid = {};
        let formIsValid = true;

        if(this.state.customerType === ''){
          formIsValid = false;
          invalid['customerType'] = true;
        }

        if(this.state.customerName === ''){
            formIsValid = false;
            invalid['customerName'] = true;
        }

        if(this.state.customerNo === ''){
            formIsValid = false;
            invalid['customerNo'] = true;
        }

        if(typeof this.state.customerEmail !== "undefined"){
            let lastAtPos = this.state.customerEmail.lastIndexOf('@');
            let lastDotPos = this.state.customerEmail.lastIndexOf('.');
      
            if (!(lastAtPos < lastDotPos && lastAtPos > 0 && this.state.customerEmail.indexOf('@@') == -1 && lastDotPos > 2 && (this.state.customerEmail.length - lastDotPos) > 2)) {
              formIsValid = false;
              invalid['customerEmail'] = true;
            }
        }

        if(this.state.projectName === ''){
            formIsValid = false;
            invalid['projectName'] = true;
        }

        if(this.state.contactName === ''){
            formIsValid = false;
            invalid['contactName'] = true;
        }

        if(typeof this.state.contactEmail !== "undefined"){
            let lastAtPos = this.state.contactEmail.lastIndexOf('@');
            let lastDotPos = this.state.contactEmail.lastIndexOf('.');
      
            if (!(lastAtPos < lastDotPos && lastAtPos > 0 && this.state.contactEmail.indexOf('@@') == -1 && lastDotPos > 2 && (this.state.contactEmail.length - lastDotPos) > 2)) {
              formIsValid = false;
              invalid['contactEmail'] = true;
            }
        }

        if(typeof this.state.startDate !== "undefined"){
            if(!this.state.startDate.match(/^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/)){
              formIsValid = false;
              invalid["startDate"] = true;
            }      	
        }

        this.setState({invalid: invalid});
        return formIsValid;
    }

    handleChanges = (e) => {
        const input = e.target;
        const name = input.name;
        const value = input.value;
        this.setState({ [name]: value });
    }

    handleFormSubmit = (event) => {
        console.log(this.state.customerType)
        event.preventDefault();

        const formIsValid = this.handleValidation();

        if (formIsValid) {
            // placeholder
        }
    };

    render() {
        const customerType = ['New', 'Existing'];
        return (
            <div>
                <h3 className="pageTitle">{i18n.t('subscriptionForm.title')}</h3>
                <div className="form-container">
                    <Form onSubmit={this.handleFormSubmit}>
                        <div className="form-desc">
                            <h4>{i18n.t('subscriptionForm.formTitle')}</h4>
                            <p>{i18n.t('subscriptionForm.desc')}</p>
                        </div>
                        <div className="bx--grid">
                            <div className="bx--row">
                                <div className="bx--col">
                                    <Select 
                                        defaultValue="customer-type" 
                                        name="customerType" 
                                        labelText={i18n.t('subscriptionForm.customerType')} 
                                        value={this.state.customerType} 
                                        onChange={this.handleChanges}
                                        invalidText={i18n.t('validation.invalid.required')}
                                        invalid={this.state.invalid['customerType']} 
                                    >
                                        <SelectItem
                                            text={i18n.t('subscriptionForm.selectType')}
                                            value="customer-type"
                                        />
                                        {customerType.map((customerType, i) => <SelectItem key={i} text={customerType} required value={customerType.toLowerCase()}>{customerType}</SelectItem>)}
                                    </Select>
                                    <TextInput 
                                        name="customerNo" 
                                        labelText={i18n.t('subscriptionForm.customerNumber')} 
                                        value={this.state.customerNo} 
                                        onChange={this.handleChanges}
                                        invalidText={i18n.t('validation.invalid.required')}
                                        invalid={this.state.invalid['customerNo']} 
                                    />
                                </div>
                                <div className="bx--col">
                                    <TextInput 
                                        name="customerName" 
                                        labelText={i18n.t('subscriptionForm.customerName')} 
                                        value={this.state.customerName} 
                                        onChange={this.handleChanges} 
                                        invalidText={i18n.t('validation.invalid.required')}
                                        invalid={this.state.invalid['customerName']} 
                                    />
                                    <TextInput 
                                        name="customerEmail" 
                                        labelText={i18n.t('subscriptionForm.customerEmail')} 
                                        value={this.state.customerEmail} 
                                        onChange={this.handleChanges}
                                        invalidText={i18n.t('validation.invalid.email')}
                                        invalid={this.state.invalid['customerEmail']} 
                                    />
                                </div>
                            </div>
                            { this.renderForm()}
                            <Button kind="primary" tabIndex={0} type="submit" > {i18n.t('buttons.submit')}  </Button>
                        </div>
                    </Form>
                </div>
            </div>    
        );
    }

    // Render the Customer Type Form
    renderForm() {
        const subscriptionLevel = ['Level1', 'Level2', 'Level3'];
        const subscriptionLength = ['1 Year','2 Years', '3 Years'];
        if (this.state.customerType === 'new') return (
            <div>
                <p><strong>{i18n.t('subscriptionForm.newSubscription')}</strong></p><br/>
                <div className="bx--row">
                    <div className="bx--col">
                        <TextInput 
                            name="projectName" 
                            labelText={i18n.t('subscriptionForm.projectName')} 
                            value={this.state.projectName} 
                            onChange={this.handleChanges} 
                            invalidText={i18n.t('validation.invalid.required')}
                            invalid={this.state.invalid['projectName']} 
                        />
                        <Select defaultValue="subscription-level" name="subscriptionLevel" labelText={i18n.t('subscriptionForm.desiredSubscriptionLevel')} value={this.state.subscriptionLevel} onChange={this.handleChanges}>
                            <SelectItem
                                text={i18n.t('subscriptionForm.chooseOption')}
                                value="subscription-level"
                            />
                            {subscriptionLevel.map((subscriptionLevel, i) => <SelectItem key={i} text={subscriptionLevel} value={subscriptionLevel.toLowerCase()}>{subscriptionLevel}</SelectItem>)}
                        </Select>
                        <TextInput 
                            name="contactName" 
                            labelText={i18n.t('subscriptionForm.contactName')} 
                            value={this.state.contactName} 
                            onChange={this.handleChanges} 
                            invalidText={i18n.t('validation.invalid.required')}
                            invalid={this.state.invalid['contactName']} 
                        />
                        <TextInput name="contactNumber" labelText={i18n.t('subscriptionForm.contactNumber')} value={this.state.contactNo} onChange={this.handleChanges} />
                    </div>
                    <div className="bx--col">
                        <DatePicker dateFormat="m/d/Y" datePickerType="simple">
                            <DatePickerInput
                                name="startDate"
                                placeholder="mm/dd/yyyy"
                                labelText={i18n.t('subscriptionForm.desiredSubscriptionStartDate')}
                                value={this.state.startDate}
                                onChange={ this.handleChanges}
                                type="text"
                                invalidText={i18n.t('validation.invalid.date')} 
                                invalid={this.state.invalid['startDate']} 
                            />
                        </DatePicker>
                        <Select defaultValue="subscription-length" name="subscriptionLength" labelText={i18n.t('subscriptionForm.desiredSubscriptionLength')} value={this.state.subscriptionLength} onChange={this.handleChanges}>
                            <SelectItem
                                text={i18n.t('subscriptionForm.chooseOption')}
                                value="subscription-length"
                            />
                            {subscriptionLength.map((subscriptionLength, i) => <SelectItem key={i} text={subscriptionLength} value={subscriptionLength.toLowerCase()}>{subscriptionLength}</SelectItem>)}
                        </Select>
                        <TextInput 
                            name="contactEmail" 
                            labelText={i18n.t('subscriptionForm.contactEmail')} 
                            value={this.state.contactEmail} 
                            onChange={this.handleChanges} 
                            invalidText={i18n.t('validation.invalid.email')} 
                            invalid={this.state.invalid['contactEmail']} 
                        />
                    </div>
                </div>
            </div>
        )

        if (this.state.customerType === 'existing') return (
            <div>
                <p><strong>{i18n.t('subscriptionForm.renewSubscription')}</strong></p><br/>
                <div className="bx--row">
                    <div className="bx--col">
                        <TextInput 
                            name="projectName" 
                            labelText={i18n.t('subscriptionForm.projectName')} 
                            value={this.state.projectName} 
                            onChange={this.handleChanges} 
                            invalidText={i18n.t('validation.invalid.required')}
                            invalid={this.state.invalid['projectName']} 
                        />
                        <Select defaultValue="subscription-level" name="subscriptionLevel" labelText={i18n.t('subscriptionForm.desiredSubscriptionLevel')} value={this.state.subscriptionLevel} onChange={this.handleChanges}>
                            <SelectItem
                                text={i18n.t('subscriptionForm.chooseOption')}
                                value="subscription-level"
                            />
                            {subscriptionLevel.map((subscriptionLevel, i) => <SelectItem key={i} text={subscriptionLevel} value={subscriptionLevel.toLowerCase()}>{subscriptionLevel}</SelectItem>)}
                        </Select>
                        <TextInput 
                            name="contactName" 
                            labelText={i18n.t('subscriptionForm.contactName')} 
                            value={this.state.contactName} 
                            onChange={this.handleChanges} 
                            invalidText={i18n.t('validation.invalid.required')}
                            invalid={this.state.invalid['contactName']}
                        />
                        <TextInput name="contactNumber" labelText={i18n.t('subscriptionForm.contactNumber')} value={this.state.contactNo} onChange={this.handleChanges} />
                    </div>
                    <div className="bx--col">
                        <DatePicker dateFormat="m/d/Y" datePickerType="simple">
                            <DatePickerInput
                                name="startDate"
                                placeholder="mm/dd/yyyy"
                                labelText={i18n.t('subscriptionForm.desiredSubscriptionStartDate')}
                                value={this.state.startDate}
                                onChange={ this.handleChanges}
                                type="text"
                                invalidText={i18n.t('validation.invalid.date')} 
                                invalid={this.state.invalid['startDate']} 
                            />
                        </DatePicker>
                        <Select defaultValue="subscription-length" name="subscriptionLength" labelText={i18n.t('subscriptionForm.desiredSubscriptionLength')} value={this.state.subscriptionLength} onChange={this.handleChanges}>
                            <SelectItem
                                text={i18n.t('subscriptionForm.chooseOption')}
                                value="subscription-length"
                            />
                            {subscriptionLength.map((subscriptionLength, i) => <SelectItem key={i} text={subscriptionLength} value={subscriptionLength.toLowerCase()}>{subscriptionLength}</SelectItem>)}
                        </Select>
                        <TextInput 
                            name="contactEmail" 
                            labelText={i18n.t('subscriptionForm.contactEmail')} 
                            value={this.state.contactEmail} 
                            onChange={this.handleChanges} 
                            invalidText={i18n.t('validation.invalid.email')} 
                            invalid={this.state.invalid['contactEmail']} 
                        />
                    </div>
                </div>
            </div>
        );
    }
    
}