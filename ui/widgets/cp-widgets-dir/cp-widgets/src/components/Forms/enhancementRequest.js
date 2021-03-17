import React, {Component} from 'react';
import { Form, TextInput, TextArea, Button } from 'carbon-components-react';
import i18n from '../../i18n';

export default class EnhancementRequest extends Component {
    state = {
        ticketNo: '',
        customerName: '',
        projectName: '',
        openedBy: '',
        priority: '',
        partnerName: '',
        enhancementDescription: '',
        invalid: {}
    };

    handleValidation() {
        let invalid = {};
        let formIsValid = true;

        if(this.state.ticketNo === ''){
          formIsValid = false;
          invalid['ticketNo'] = true;
        }

        if(this.state.customerName === ''){
            formIsValid = false;
            invalid['customerName'] = true;
        }

        if(this.state.projectName === ''){
            formIsValid = false;
            invalid['projectName'] = true;
        }

        if(this.state.openedBy === ''){
            formIsValid = false;
            invalid['openedBy'] = true;
        }

        if(this.state.partnerName === ''){
            formIsValid = false;
            invalid['partnerName'] = true;
        }

        if(this.state.enhancementDescription === ''){
            formIsValid = false;
            invalid['enhancementDescription'] = true;
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
        console.log(this.state.ticketNo)
        event.preventDefault();

        const formIsValid = this.handleValidation();

        if (formIsValid) {
            // placeholder
        }
    };
      
    render() {
        return (
            <div>
                <h3 className="pageTitle">{i18n.t('enhancementForm.title')}</h3>
                <div className="form-container">
                    <Form onSubmit={this.handleFormSubmit}>
                        <div className="form-desc">
                            <h4>{i18n.t('enhancementForm.formTitle')}</h4>
                            <p>{i18n.t('enhancementForm.desc')}</p>
                        </div>
                        <div className="bx--grid">
                            <div className="bx--row">
                                <div className="bx--col">
                                    <TextInput 
                                        name="ticketNo" 
                                        labelText={i18n.t('enhancementForm.ticketNumber')} 
                                        value={this.state.ticketNo} 
                                        onChange={this.handleChanges}
                                        invalidText={i18n.t('validation.invalid.required')}
                                        invalid={this.state.invalid['ticketNo']} 
                                    />
                                    <TextInput 
                                        name="projectName" 
                                        labelText={i18n.t('enhancementForm.projectName')} 
                                        value={this.state.projectName} 
                                        onChange={this.handleChanges}
                                        invalidText={i18n.t('validation.invalid.required')}
                                        invalid={this.state.invalid['projectName']} 
                                    />
                                    <TextInput 
                                        name="priority" 
                                        labelText={i18n.t('enhancementForm.priority')} 
                                        value={this.state.priority} 
                                        onChange={this.handleChanges}
                                    />
                                </div>
                                <div className="bx--col">
                                    <TextInput 
                                        name="customerName" 
                                        labelText={i18n.t('enhancementForm.customerName')} 
                                        value={this.state.customerName} 
                                        onChange={this.handleChanges}
                                        invalidText={i18n.t('validation.invalid.required')}
                                        invalid={this.state.invalid['customerName']} 
                                    />
                                    <TextInput 
                                        name="openedBy" 
                                        labelText={i18n.t('enhancementForm.ticketOpenedBy')} 
                                        value={this.state.openedBy} 
                                        onChange={this.handleChanges}
                                        invalidText={i18n.t('validation.invalid.required')}
                                        invalid={this.state.invalid['openedBy']} 
                                    />
                                    <TextInput 
                                        name="partnerName" 
                                        labelText={i18n.t('enhancementForm.partnerName')} 
                                        value={this.state.partnerName} 
                                        onChange={this.handleChanges}
                                        invalidText={i18n.t('validation.invalid.required')}
                                        invalid={this.state.invalid['partnerName']} 
                                    />
                                </div>
                            </div>
                            <div className="bx--row">
                                <div className="bx--col">
                                    <TextArea 
                                        labelText={i18n.t('enhancementForm.enhancementDescription')} 
                                        placeholder={i18n.t('enhancementForm.addenhancementDescription')} 
                                        name="enhancementDescription"  
                                        value={this.state.enhancementDescription} 
                                        onChange={this.handleChanges}  
                                        invalidText={i18n.t('validation.invalid.required')}
                                        invalid={this.state.invalid['enhancementDescription']} 
                                    />
                                    <Button kind="primary" tabIndex={0} type="submit"> {i18n.t('buttons.submit')}  </Button>
                                </div>
                            </div>
                        </div>
                    </Form>
                </div>
            </div>    
        );
    }
}