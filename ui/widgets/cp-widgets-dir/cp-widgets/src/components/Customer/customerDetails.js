import React from 'react';
import i18n from '../../i18n';
import { Tile } from 'carbon-components-react';
import { apiCustomerGet } from '../../api/customers';
import withKeycloak from '../../auth/withKeycloak';

const customerData = {
  name: 'Ford',
  id: '5564 4563 3345',
  startDate: '01/01/2020',
};

class CustomerDetails extends React.Component {
  constructor() {
    super();
    this.state = {
      customer: {},
    };
  }
  componentDidMount() {
    const { keycloak } = this.props;
    const authenticated = keycloak.initialized && keycloak.authenticated;

    if (authenticated) {
      this.getCustomer(this.props.customerNumber);
    }
  }

  componentDidUpdate(prevProps) {
    const { keycloak } = this.props;
    const authenticated = keycloak.initialized && keycloak.authenticated;

    const changedAuth = prevProps.keycloak.authenticated !== authenticated;

    if (authenticated && changedAuth) {
      this.getCustomer(this.props.customerNumber);
    }
  }

  async getCustomer() {
    const { keycloak } = this.props;
    const authenticated = keycloak.initialized && keycloak.authenticated;

    if (authenticated) {
      const customer = await apiCustomerGet(this.props.serviceUrl, this.props.customerNumber);
      this.setState({
        customer: customer.data,
      });
    }
  }

  render() {
    const { name, id, startDate } = customerData; //destructuring
    return (
      <div className="customer-details">
        <Tile>
          <p>
            <strong>{i18n.t('customerDashboard.customerName')}</strong> {this.state.customer.name}
          </p>
          <p>
            <strong>{i18n.t('customerDashboard.customerId')}</strong> {this.state.customer.id}
          </p>
        </Tile>
      </div>
    );
  }
}

export default withKeycloak(CustomerDetails);
