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
        contactNo: ''
    };

    handleChanges = (e) => {
        const input = e.target;
        const name = input.name;
        const value = input.value;
        this.setState({ [name]: value });
    }

    handleFormSubmit = (event) => {
        console.log(this.state.customerType)
        event.preventDefault();
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
                                    <Select defaultValue="customer-type" name="customerType" labelText={i18n.t('subscriptionForm.customerType')} required value={this.state.customerType} onChange={this.handleChanges}>
                                        <SelectItem
                                            text={i18n.t('subscriptionForm.selectType')}
                                            value="customer-type"
                                        />
                                        {customerType.map((customerType, i) => <SelectItem key={i} text={customerType} required value={customerType.toLowerCase()}>{customerType}</SelectItem>)}
                                    </Select>
                                    <TextInput name="customerNo" labelText={i18n.t('subscriptionForm.customerNumber')} required value={this.state.customerNo} onChange={this.handleChanges}/>
                                </div>
                                <div className="bx--col">
                                    <TextInput name="customerName" labelText={i18n.t('subscriptionForm.customerName')} required value={this.state.customerName} onChange={this.handleChanges} />
                                    <TextInput name="customerEmail" labelText={i18n.t('subscriptionForm.customerEmail')} required value={this.state.customerEmail} onChange={this.handleChanges}/>
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
                        <TextInput name="projectName" labelText={i18n.t('subscriptionForm.projectName')} required value={this.state.projectName} onChange={this.handleChanges} />
                        <Select defaultValue="subscription-level" name="subscriptionLevel" labelText={i18n.t('subscriptionForm.desiredSubscriptionLevel')} value={this.state.subscriptionLevel} onChange={this.handleChanges}>
                            <SelectItem
                                text={i18n.t('subscriptionForm.chooseOption')}
                                value="subscription-level"
                            />
                            {subscriptionLevel.map((subscriptionLevel, i) => <SelectItem key={i} text={subscriptionLevel} value={subscriptionLevel.toLowerCase()}>{subscriptionLevel}</SelectItem>)}
                        </Select>
                        <TextInput name="contactName" labelText={i18n.t('subscriptionForm.contactName')} required value={this.state.contactName} onChange={this.handleChanges} />
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
                                required
                            />
                        </DatePicker>
                        <Select defaultValue="subscription-length" name="subscriptionLength" labelText={i18n.t('subscriptionForm.desiredSubscriptionLength')} value={this.state.subscriptionLength} onChange={this.handleChanges}>
                            <SelectItem
                                text={i18n.t('subscriptionForm.chooseOption')}
                                value="subscription-length"
                            />
                            {subscriptionLength.map((subscriptionLength, i) => <SelectItem key={i} text={subscriptionLength} value={subscriptionLength.toLowerCase()}>{subscriptionLength}</SelectItem>)}
                        </Select>
                        <TextInput name="contactEmail" labelText={i18n.t('subscriptionForm.contactEmail')} required value={this.state.contactEmail} onChange={this.handleChanges} />
                    </div>
                </div>
            </div>
        )

        if (this.state.customerType === 'existing') return (
            <div>
                <p><strong>{i18n.t('subscriptionForm.renewSubscription')}</strong></p><br/>
                <div className="bx--row">
                    <div className="bx--col">
                        <TextInput name="projectName" labelText={i18n.t('subscriptionForm.projectName')} required value={this.state.projectName} onChange={this.handleChanges} />
                        <Select defaultValue="subscription-level" name="subscriptionLevel" labelText={i18n.t('subscriptionForm.desiredSubscriptionLevel')} value={this.state.subscriptionLevel} onChange={this.handleChanges}>
                            <SelectItem
                                text={i18n.t('subscriptionForm.chooseOption')}
                                value="subscription-level"
                            />
                            {subscriptionLevel.map((subscriptionLevel, i) => <SelectItem key={i} text={subscriptionLevel} value={subscriptionLevel.toLowerCase()}>{subscriptionLevel}</SelectItem>)}
                        </Select>
                        <TextInput name="contactName" labelText={i18n.t('subscriptionForm.contactName')} required value={this.state.contactName} onChange={this.handleChanges} />
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
                                required
                            />
                        </DatePicker>
                        <Select defaultValue="subscription-length" name="subscriptionLength" labelText={i18n.t('subscriptionForm.desiredSubscriptionLength')} value={this.state.subscriptionLength} onChange={this.handleChanges}>
                            <SelectItem
                                text={i18n.t('subscriptionForm.chooseOption')}
                                value="subscription-length"
                            />
                            {subscriptionLength.map((subscriptionLength, i) => <SelectItem key={i} text={subscriptionLength} value={subscriptionLength.toLowerCase()}>{subscriptionLength}</SelectItem>)}
                        </Select>
                        <TextInput name="contactEmail" labelText={i18n.t('subscriptionForm.contactEmail')} required value={this.state.contactEmail} onChange={this.handleChanges} />
                    </div>
                </div>
            </div>
        );
    }
    
}