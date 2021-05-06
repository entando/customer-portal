import {Component} from 'react';
import i18n from '../../i18n';
import { Tile } from 'carbon-components-react';
import { apiCustomerGet } from '../../api/customers';
import withKeycloak from '../../auth/withKeycloak';
import {authenticationChanged, isAuthenticated} from "../../api/helpers";

class CustomerDetails extends Component {
  constructor() {
    super();
    this.state = {
      customer: {},
    };
  }

  componentDidMount() {
    if (isAuthenticated(this.props)) {
      this.fetchData();
    }
  }

  componentDidUpdate(prevProps) {
    if (authenticationChanged(this.props, prevProps)) {
      this.fetchData();
    }
  }

  async fetchData() {
    try {
      const customer = await apiCustomerGet(this.props.serviceUrl, this.props.customerId);
      this.setState({
        customer: customer.data,
      });
    } catch (err) {
      console.error(err);
    }
  }

  render() {
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
