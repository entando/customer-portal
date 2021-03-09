import React, {Component} from 'react';
import { ModalWrapper, Form, TextInput, Select, SelectItem } from 'carbon-components-react';

export default class AddProjectModal extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            customerList: '',
            projectName: '',
            projectDescription: '',
            systemId: '',
            contactName: '',
            contactPhone: '',
            contactEmail:'',
            notes:''
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
        console.log('Project Name:', this.state.customerList);
        console.log('Project Name:', this.state.projectName);
        console.log('project Description:', this.state.projectDescription);
        console.log('SystemId:', this.state.systemId);
        console.log('Contact Name:', this.state.contactName);
        console.log('Contact Phone:', this.state.contactPhone);
        console.log('Contact email:', this.state.contactEmail);
        console.log('Notes:', this.state.notes);
    };

    isValid() {
        if (this.state.customerName === '') {
          return false;
        }
        return true;
    }
    
    render() {
        const customerList = ['Customer1', 'Customer2', 'Customer3'];
        return (
            <ModalWrapper
                buttonTriggerText="Add a project + "
                modalHeading="Add a project"
                buttonTriggerClassName="add-project bx--btn bx--btn--tertiary"
                className="modal-form"
            >
                <p> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse cursus fermentum risus, sit amet fringilla nunc pellentesque quis. </p>
                <div className="form-container">
                    <Form onSubmit={this.handleFormSubmit}>
                        <Select defaultValue="customer-list" name="customerList" labelText="Customer List" value={this.state.customerList} onChange={this.handleChanges}>
                            <SelectItem
                                text="Select Customer"
                                value="customer-list"
                            />
                            {customerList.map((customerList, i) => <SelectItem key={i} text={customerList} value={customerList.toLowerCase()}>{customerList}</SelectItem>)}
                        </Select>

                        <TextInput name="projectName" labelText="Project Name" value={this.state.customerName} onChange={this.handleChanges}  errorMessage={this.isValid() ? '' : 'This field is required'}/>
                        <TextInput name="projectDescription" labelText="Project Description" value={this.state.customerNumber} onChange={this.handleChanges} />
                        <TextInput name="systemId" labelText="System Id" value='' onChange=''value={this.state.systemId} onChange={this.handleChanges} />
                        <TextInput name="contactName" labelText="Contact Name" value={this.state.contactName} onChange={this.handleChanges} />
                        <TextInput name="contactPhone" labelText="Contact Phone" value={this.state.contactPhone} onChange={this.handleChanges} />
                        <TextInput name="contactEmail" labelText="Contact Email" value={this.state.contactEmail} onChange={this.handleChanges} />
                        <TextInput name="notes" labelText="Notes" value={this.state.notes} onChange={this.handleChanges} />
                        <button disabled={!this.isValid()} type="submit">Submit</button>
                    </Form>
                </div> 
            </ModalWrapper>
        )
    }
}


