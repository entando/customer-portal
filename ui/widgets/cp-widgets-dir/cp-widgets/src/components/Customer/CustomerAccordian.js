import React from 'react';
import {Link} from 'react-router-dom';
import {AccordionItem, Button} from 'carbon-components-react';
import withKeycloak from '../../auth/withKeycloak';
import {
  apiCustomerGet,
  apiCustomerDelete,
  apiGetCustomersProjects,
  apiGetMyCustomersProjects
} from '../../api/customers';
import CustomerDataTable from './CustomerDataTable';
import CustomerDetails from './CustomerDetails';
import {isPortalAdminOrSupport, isPortalAdmin, isPortalCustomer} from '../../api/helpers';
import EditCustomerModal from '../Admin/EditCustomerModal';
import i18n from '../../i18n';

class CustomerAccordian extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: {},
      customer: {},
      authenticated: false,
    };
  }

  componentDidMount() {
    const { keycloak } = this.props;
    const authenticated = keycloak.initialized && keycloak.authenticated;

    if (authenticated) {
      this.getCustomersProjects(this.props.customerNumber);
    }
  }

  componentDidUpdate(prevProps) {
    const { keycloak } = this.props;
    const authenticated = keycloak.initialized && keycloak.authenticated;

    const changedAuth = prevProps.keycloak.authenticated !== authenticated;

    if (authenticated && changedAuth) {
      this.getCustomersProjects(this.props.customerNumber);
    }
  }

  async getCustomersProjects(id) {
    const { keycloak } = this.props;
    const authenticated = keycloak.initialized && keycloak.authenticated;
    if (authenticated) {
      const customer = await apiCustomerGet(this.props.serviceUrl, id);

      var projects;
      try {
        if (isPortalAdminOrSupport()) {
          projects = await apiGetCustomersProjects(this.props.serviceUrl, id);
        } else {
          projects = await apiGetMyCustomersProjects(this.props.serviceUrl, id);
        }

        this.setState({
          projects: projects.data,
          customer: customer.data,
        });
      } catch (error) {
        console.log(error);
      }
    }
  }

  async deleteCustomer() {
    return await apiCustomerDelete(this.props.serviceUrl, this.state.customer.id);
  }

  handleDelete() {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      this.deleteCustomer().then(() => {
        this.props.updateCustomerList();
      });
    }
  }

  render() {
    return (
      <div>
        <div>
          {isPortalCustomer() ? <CustomerDetails serviceUrl={this.props.serviceUrl} customerNumber={this.props.customerNumber} /> : null}
          <AccordionItem title={this.props.title} open={this.props.accordionOpened}>
            <div style={{ display: 'flex' }}>
              {isPortalAdminOrSupport() ? (
                <Link style={{ textDecoration: 'none' }} to={`/customer-details/${this.state.customer.id}`}>
                  <Button kind="ghost">{i18n.t('buttons.viewDetails')}</Button>
                </Link>
              ) : null}
              {isPortalAdmin() ? (
                <div style={{ display: 'flex' }}>
                  <EditCustomerModal
                    serviceUrl={this.props.serviceUrl}
                    customer={this.state.customer}
                    key={this.state.customer.id}
                    updateCustomerList={this.props.updateCustomerList}
                    customerId={this.state.customer.id}
                  />
                  <Button kind="ghost" style={{ color: 'red' }} onClick={() => this.handleDelete()}>
                    {i18n.t('buttons.delete')}
                  </Button>
                </div>
              ) : null}
            </div>
            <CustomerDataTable
              key={new Date().getTime()}
              serviceUrl={this.props.serviceUrl}
              customerNumber={this.props.customerNumber}
              locale={this.props.locale}
              updateCustomerList={this.props.updateCustomerList}
            />
          </AccordionItem>
        </div>
      </div>
    );
  }
}

export default withKeycloak(CustomerAccordian);
