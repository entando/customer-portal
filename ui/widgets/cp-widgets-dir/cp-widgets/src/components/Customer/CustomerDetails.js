import {Component} from 'react';
import i18n from '../../i18n';
import { Tile } from 'carbon-components-react';
import withKeycloak from '../../auth/withKeycloak';

class CustomerDetails extends Component {
  constructor() {
    super();
    this.state = {
      customer: {},
    };
  }

  render() {
    return (
      <div className="customer-details">
        <Tile style={{margin: '2em 0', minHeight: '0', paddingBottom: '0'}}>
          <div>
            <strong>{i18n.t('customerDashboard.customerId')}</strong> {this.props.customer.id}
          </div>
          <div>
            <strong>{i18n.t('customerDashboard.customerName')}</strong> {this.props.customer.name}
          </div>
        </Tile>
      </div>
    );
  }
}

export default withKeycloak(CustomerDetails);
