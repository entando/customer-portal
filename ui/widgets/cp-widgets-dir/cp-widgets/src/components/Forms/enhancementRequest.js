import React, {Component} from 'react';
import { Form, TextInput, TextArea, Button } from 'carbon-components-react';

export default class EnhancementRequest extends Component {
    state = {
        ticketNo: '',
        customerName: '',
        projectName: '',
        openedBy: '',
        priority: '',
        partnerName: '',
        enhancementDescription: ''
    };

    handleChanges = (e) => {
        const input = e.target;
        const name = input.name;
        const value = input.value;
        this.setState({ [name]: value });
    }

    handleFormSubmit = (event) => {
        console.log(this.state.ticketNo)
        event.preventDefault();
    };
      
    render() {
        const textareaProps = {
            labelText: 'Enhancement Description',
            placeholder: 'Add enhancement description',
            name: 'enhamcementDescription',
        }
        return (
            <div className="form-container">
                <Form onSubmit={this.handleFormSubmit}>
                    <div className="form-desc">
                        <h3>Request for Enhancements</h3>
                        <p>Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. </p>
                    </div>
                    <div className="bx--grid">
                        <div className="bx--row">
                            <div className="bx--col">
                                <TextInput name="ticketNo" labelText="Ticket Number" value={this.state.ticketNo} onChange={this.handleChanges}/>
                                <TextInput name="projectName" labelText="Project Name" value={this.state.projectName} onChange={this.handleChanges}/>
                                <TextInput name="priority" labelText="Priority" value={this.state.priority} onChange={this.handleChanges}/>
                            </div>
                            <div className="bx--col">
                                 <TextInput name="customerName" labelText="Customer Name" value={this.state.customerName} onChange={this.handleChanges}/>
                                 <TextInput name="openedBy" labelText="Ticket Opened By" value={this.state.openedBy} onChange={this.handleChanges}/>
                                 <TextInput name="partnerName" labelText="Partner Name" value={this.state.partnerName} onChange={this.handleChanges}/>
                            </div>
                        </div>
                        <div className="bx--row">
                            <div className="bx--col">
                                <TextArea {...textareaProps} value={this.state.enhancementDescription} onChange={this.handleChanges}  />
                                <Button kind="primary" tabIndex={0} type="submit" > Submit  </Button>
                            </div>
                        </div>
                    </div>
                </Form>
            </div>
        );
    }
}