import React, { Component } from 'react';
import { Form, TextInput, Select, SelectItem, Button} from 'carbon-components-react';

class AssignUSer extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            projectName:'',
            assignUser:'',
            selectRole:''
        }
    }
    
    handleChanges = (e) => {
        const input = e.target;
        const name = input.name;
        const value = input.value;
        this.setState({ [name]: value });
    }

    handleFormSubmit = (event) => {
        console.log(this.state.assignUser)
        event.preventDefault();
    };

    render() { 
        const assignUser = ['User1', 'User2'];
        const selectRole = ['Role1', 'Role2'];
        return (
            <div className="">
                <Form onSubmit={this.handleFormSubmit}>
                <div className="bx--grid">
                        <div className="bx--row">
                            <div className="bx--col">
                                <TextInput name="projectName" labelText="Project Name" value={this.state.projectName} onChange={this.handleChanges}/>
                            </div>
                        </div>
                        <div className="bx--row">
                            <div className="bx--col">
                                <Select defaultValue="assign-user" name="assignUser" labelText="Assign User" value={this.state.assignUser} onChange={this.handleChanges}>
                                    <SelectItem
                                        text="Assign User"
                                        value="assign-user"
                                    />
                                    {assignUser.map((assignUser, i) => <SelectItem key={i} text={assignUser} value={assignUser.toLowerCase()}>{assignUser}</SelectItem>)}
                                </Select>
                            </div>
                            <div className="bx--col">
                                <Select defaultValue="select-role" name="selectRole" labelText="Select Role" value={this.state.selectRole} onChange={this.handleChanges}>
                                    <SelectItem
                                        text="Select Role"
                                        value="select-role"
                                    />
                                    {selectRole.map((selectRole, i) => <SelectItem key={i} text={selectRole} value={selectRole.toLowerCase()}>{selectRole}</SelectItem>)}
                                </Select>
                            </div>
                        </div>
                        <Button kind="primary" tabIndex={0} type="submit" > Submit  </Button>
                    </div>
                </Form>
            </div>
        );
    }
}
 
export default AssignUSer;