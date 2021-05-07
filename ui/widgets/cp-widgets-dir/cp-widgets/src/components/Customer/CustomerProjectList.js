import React from 'react';
import {Tile} from 'carbon-components-react';
import withKeycloak from '../../auth/withKeycloak';
import {apiCustomerGet} from '../../api/customers';
import {authenticationChanged, isAuthenticated, isPortalAdminOrSupport} from '../../api/helpers';
import i18n from '../../i18n';
import CustomerDataTable from './CustomerDataTable';

class CustomerProjectList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      customer: {},
    };
  }

  async fetchData() {
    if (isAuthenticated(this.props)) {
      try {
        const customer = await apiCustomerGet(this.props.serviceUrl, this.props.match.params.id);
        this.setState({
          customer: customer.data,
          loading: false,
        });
      } catch (err) {
        console.log(err);
      }
    }
  }

  componentDidMount() {
    if (isPortalAdminOrSupport()) {
      this.fetchData();
    }
  }

  componentDidUpdate(prevProps) {
    if (authenticationChanged(this.props, prevProps)) {
      if (isPortalAdminOrSupport()) {
        this.fetchData();
      }
    }
  }

  render() {
    if (!this.state.loading) {
      if (isPortalAdminOrSupport()) {
        const customer = this.state.customer;
        if (customer) {
          return (
            <div>
              <Tile>
                <div className="bx--grid">
                  <div className="bx--row">
                    <div className="bx--col">
                      <p>
                        <strong>{i18n.t('customerDetails.id')}: </strong> {customer.id}
                      </p>
                      <p>
                        <strong>{i18n.t('customerDetails.name')}: </strong> {customer.name}
                      </p>
                      <p>
                        <strong>{i18n.t('customerDetails.notes')}: </strong> {customer.notes}
                      </p>
                    </div>
                    <div className="bx--col">
                      <p>
                        <strong>{i18n.t('customerDetails.contactName')}: </strong> {customer.contactName}
                      </p>
                      <p>
                        <strong>{i18n.t('customerDetails.contactPhone')}: </strong> {customer.contactPhone}
                      </p>
                      <p>
                        <strong>{i18n.t('customerDetails.contactEmail')}: </strong> {customer.contactEmail}
                      </p>
                    </div>
                  </div>
                </div>
              </Tile>
              <CustomerDataTable serviceUrl={this.props.serviceUrl} customerId={customer.id}
                                 locale={this.props.locale}/>
            </div>
          );
        } else {
          return <p>{i18n.t('userMessages.loading')}...</p>;
        }
      } else {
        return <p>{i18n.t('userMessages.unauthorized')}</p>;
      }
    } else {
      return null;
    }
  }
}

export default withKeycloak(CustomerProjectList);
