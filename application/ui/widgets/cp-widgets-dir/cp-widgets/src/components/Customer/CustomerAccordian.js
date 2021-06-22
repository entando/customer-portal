import {Component} from 'react';
import {Link} from 'react-router-dom';
import {AccordionItem, Button} from 'carbon-components-react';
import withKeycloak from '../../auth/withKeycloak';
import {apiCustomerGet, apiCustomerDelete} from '../../api/customers';
import CustomerDataTable from './CustomerDataTable';
import CustomerDetails from './CustomerDetails';
import {
  isPortalAdminOrSupport,
  isPortalAdmin,
  isPortalCustomer,
  isAuthenticated,
  authenticationChanged
} from '../../api/helpers';
import EditCustomerModal from '../Admin/EditCustomerModal';
import i18n from '../../i18n';
import AddProjectModal from '../Admin/AddProjectModal';

class CustomerAccordian extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: {},
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
    const customerId = this.props.customerId;
    try {
      const customer = await apiCustomerGet(this.props.serviceUrl, customerId);
      this.setState({
        customer: customer.data,
      });
    } catch (error) {
      console.log(error);
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
          {isPortalCustomer() && <CustomerDetails serviceUrl={this.props.serviceUrl} customer={this.state.customer}/>}
          <AccordionItem title={this.props.title} open={this.props.accordionOpened}>
            <div style={{display: 'flex'}}>
              {isPortalAdminOrSupport() && (
                <Link style={{textDecoration: 'none'}} to={`/customer-details/${this.state.customer.id}`}>
                  <Button kind="ghost">{i18n.t('buttons.viewDetails')}</Button>
                </Link>
              )}
              {isPortalAdmin() && (
                <div style={{display: 'flex'}}>
                  <EditCustomerModal
                    serviceUrl={this.props.serviceUrl}
                    customer={this.state.customer}
                    key={this.state.customer.id}
                    updateCustomerList={this.props.updateCustomerList}
                    customerId={this.state.customer.id}
                  />
                  <Button kind="ghost" style={{color: 'red'}} onClick={() => this.handleDelete()}>
                    {i18n.t('buttons.delete')}
                  </Button>

                  <AddProjectModal serviceUrl={this.props.serviceUrl}
                                   customer={this.state.customer}
                                   updateCustomerList={this.props.updateCustomerList}/>
                </div>
              )}
            </div>
            <CustomerDataTable
              key={new Date().getTime()}
              serviceUrl={this.props.serviceUrl}
              customer={this.state.customer}
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
