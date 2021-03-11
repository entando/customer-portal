import React, {Component} from 'react';
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
                <h3 className="pageTitle">Welcome to Entando Portal</h3>
                <div className="form-container">
                    <Form onSubmit={this.handleFormSubmit}>
                        <div className="form-desc">
                            <h4>New / Renew Subscription</h4>
                            <p>Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. </p>
                        </div>
                        <div className="bx--grid">
                            <div className="bx--row">
                                <div className="bx--col">
                                    <Select defaultValue="customer-type" name="customerType" labelText="Customer Type *" required value={this.state.customerType} onChange={this.handleChanges}>
                                        <SelectItem
                                            text="Select Customer Type"
                                            value="customer-type"
                                        />
                                        {customerType.map((customerType, i) => <SelectItem key={i} text={customerType} required value={customerType.toLowerCase()}>{customerType}</SelectItem>)}
                                    </Select>
                                    <TextInput name="customerNo" labelText="Customer Number *" required value={this.state.customerNo} onChange={this.handleChanges}/>
                                </div>
                                <div className="bx--col">
                                    <TextInput name="customerName" labelText="Customer Name *" required value={this.state.customerName} onChange={this.handleChanges} />
                                    <TextInput name="customerEmail" labelText="Customer Email *" required value={this.state.customerEmail} onChange={this.handleChanges}/>
                                </div>
                            </div>
                            { this.renderForm()}
                            <Button kind="primary" tabIndex={0} type="submit" > Submit  </Button>
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
                <p><strong>New Subscription</strong></p><br/>
                <div className="bx--row">
                    <div className="bx--col">
                        <TextInput name="projectName" labelText="Project Name *" required value={this.state.projectName} onChange={this.handleChanges} />
                        <Select defaultValue="subscription-level" name="subscriptionLevel" labelText="Desired subscription Level" value={this.state.subscriptionLevel} onChange={this.handleChanges}>
                            <SelectItem
                                text="Choose an option"
                                value="subscription-level"
                            />
                            {subscriptionLevel.map((subscriptionLevel, i) => <SelectItem key={i} text={subscriptionLevel} value={subscriptionLevel.toLowerCase()}>{subscriptionLevel}</SelectItem>)}
                        </Select>
                        <TextInput name="contactName" labelText="Contact Name *" required value={this.state.contactName} onChange={this.handleChanges} />
                        <TextInput name="contactNumber" labelText="Contact Phone Number" value={this.state.contactNo} onChange={this.handleChanges} />
                    </div>
                    <div className="bx--col">
                        <DatePicker dateFormat="m/d/Y" datePickerType="simple">
                            <DatePickerInput
                                name="startDate"
                                placeholder="mm/dd/yyyy"
                                labelText="Desired Subscription Start Date *"
                                value={this.state.startDate}
                                onChange={ this.handleChanges}
                                type="text"
                                required
                            />
                        </DatePicker>
                        <Select defaultValue="subscription-length" name="subscriptionLength" labelText="Desired subscription Length" value={this.state.subscriptionLength} onChange={this.handleChanges}>
                            <SelectItem
                                text="Choose an option"
                                value="subscription-length"
                            />
                            {subscriptionLength.map((subscriptionLength, i) => <SelectItem key={i} text={subscriptionLength} value={subscriptionLength.toLowerCase()}>{subscriptionLength}</SelectItem>)}
                        </Select>
                        <TextInput name="contactEmail" labelText="Contact Email *" required value={this.state.contactEmail} onChange={this.handleChanges} />
                    </div>
                </div>
            </div>
        )

        if (this.state.customerType === 'existing') return (
            <div>
                <p><strong>Renew Subscription</strong></p><br/>
                <div className="bx--row">
                    <div className="bx--col">
                        <TextInput name="projectName" labelText="Project Name" value={this.state.projectName} onChange={this.handleChanges} />
                        <Select defaultValue="subscription-level" name="subscriptionLevel" labelText="Desired subscription Level" value={this.state.subscriptionLevel} onChange={this.handleChanges}>
                            <SelectItem
                                text="Choose an option"
                                value="subscription-level"
                            />
                            {subscriptionLevel.map((subscriptionLevel, i) => <SelectItem key={i} text={subscriptionLevel} value={subscriptionLevel.toLowerCase()}>{subscriptionLevel}</SelectItem>)}
                        </Select>
                        <TextInput name="contactName" labelText="Contact Name *" required value={this.state.contactName} onChange={this.handleChanges} />
                        <TextInput name="contactNumber" labelText="Contact Phone Number" value={this.state.contactNo} onChange={this.handleChanges} />
                    </div>
                    <div className="bx--col">
                        <DatePicker dateFormat="m/d/Y" datePickerType="simple">
                            <DatePickerInput
                                name="startDate"
                                placeholder="mm/dd/yyyy"
                                labelText="Desired Subscription Start Date *"
                                value={this.state.startDate}
                                onChange={ this.handleChanges}
                                type="text"
                                required
                            />
                        </DatePicker>
                        <Select defaultValue="subscription-length" name="subscriptionLength" labelText="Desired subscription Length" value={this.state.subscriptionLength} onChange={this.handleChanges}>
                            <SelectItem
                                text="Choose an option"
                                value="subscription-length"
                            />
                            {subscriptionLength.map((subscriptionLength, i) => <SelectItem key={i} text={subscriptionLength} value={subscriptionLength.toLowerCase()}>{subscriptionLength}</SelectItem>)}
                        </Select>
                        <TextInput name="contactEmail" labelText="Contact Email *" required value={this.state.contactEmail} onChange={this.handleChanges} />
                    </div>
                </div>
            </div>
        );
    }
    
}