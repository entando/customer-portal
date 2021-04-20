import React, { Component } from 'react';
import { Select, SelectItem } from 'carbon-components-react';
import CustomerDetails from '../Customer/customerDetails';
import AdminDashboard from './AdminDashboard';
import '../../index.scss';
import CustomerDataTable from "../Customer/customerDataTable";

export default class RoleCheck extends Component {
  state = {
    roleType: 'customer',
  };

  handleChanges = e => {
    const input = e.target;
    const name = input.name;
    const value = input.value;
    this.setState({ [name]: value });
  };

  render() {
    const roleType = ['Admin', 'Customer'];
    return (
      <div className="role-check">
        <Select
          defaultValue="role-type"
          id="roleType"
          name="roleType"
          labelText="Select Role(Testing)"
          value={this.state.roleType}
          onChange={this.handleChanges}
        >
          <SelectItem text="Select Role" value="role-type" />
          {roleType.map((roleType, i) => (
            <SelectItem key={i} text={roleType} value={roleType.toLowerCase()}>
              {roleType}
            </SelectItem>
          ))}
        </Select>
        {this.renderForm()}
      </div>
    );
  }

  // Render Dashboard based on role
  renderForm() {
    if (this.state.roleType === 'customer')
      return (
        <div>
          <h3 className="pageTitle">Welcome to Entando Customer Portal</h3>
          <CustomerDetails />
          <CustomerDataTable />
        </div>
      );
    if (this.state.roleType === 'admin')
      return (
        <div>
          <h3 className="pageTitle">Welcome to Entando Admin View</h3>
          <AdminDashboard />
        </div>
      );
  }
}
