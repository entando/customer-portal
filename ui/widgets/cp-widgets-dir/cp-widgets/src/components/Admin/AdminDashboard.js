import React from 'react';
import i18n from '../../i18n';
import { Accordion, PaginationNav, Search, Tile } from 'carbon-components-react';
import AddCustomerModal from './AddCustomerModal';
import AddPartnerModal from './AddPartnerModal';
import AddProjectModal from './AddProjectModal';
import withKeycloak from '../../auth/withKeycloak';
import {apiCustomersGet} from '../../api/customers';
import CustomerAccordian from '../Customer/CustomerAccordian';
import {
  authenticationChanged,
  isPortalAdmin,
  isPortalSupport,
  isPortalPartner,
  isPortalCustomer,
  isPortalUser,
  isAuthenticated
} from '../../api/helpers';

class AdminDashboard extends React.Component {
  constructor() {
    super();
    this.state = {
      customers: {},
      role: '',
      filteredCustomers: {},
      currentPage: 0,
      test: '',
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps) {
    if (authenticationChanged(this.props, prevProps)) {
      this.fetchData();
    }
  }

  async fetchData() {
    if (isAuthenticated(this.props)) {
      const customers = await apiCustomersGet(this.props.serviceUrl);
      this.setState({
        customers: customers.data,
        filteredCustomers: customers.data,
      });
    }
  }

  handleSearch = event => {
    if (event.key === 'Enter') {
      //Note: should refactor this to preform filtering in db
      const newFilteredState = this.state.customers.filter(customer =>
        customer.name.toLowerCase().includes(event.target.value.toLowerCase())
      );
      this.setState({
        filteredCustomers: newFilteredState,
        currentPage: 0,
      });
    } else {
      if (event.target.value === '' || event.target.value === undefined) {
        this.setState({
          filteredCustomers: this.state.customers,
        });
      }
    }
    this.forceUpdate();
  };

  updateCustomerList = () => {
    this.fetchData();
  };

  render() {
    var numberOfPages = 1;
    if (Object.keys(this.state.filteredCustomers).length !== 0) {
      numberOfPages = Math.ceil(this.state.filteredCustomers.length / 5);
    } else {
      numberOfPages = 1;
    }

    const props = () => ({
      loop: Boolean(false),
      page: Number(this.state.currentPage),
      totalItems: Number(numberOfPages),
      itemsShown: Number(1),
      onChange: event => this.setState({ currentPage: event }),
    });

    return (
      <div className="admin-dashboard">
        {isPortalAdmin() ? (
          <h3 className="pageTitle">{i18n.t('adminDashboard.adminTitle')}</h3>
        ) : isPortalSupport() ? (
          <h3 className="pageTitle">{i18n.t('adminDashboard.supportTitle')}</h3>
        ) : isPortalCustomer() ? (
          <h3 className="pageTitle">{i18n.t('adminDashboard.customerTitle')}</h3>
        ) : isPortalPartner() ? (
          <h3 className="pageTitle">{i18n.t('adminDashboard.partnerTitle')}</h3>
        ) : null}
        {isPortalAdmin() || isPortalSupport() || isPortalPartner() ? (
          <Tile>
            <p className="title">{i18n.t('adminDashboard.allCustomers')}</p>
            <div className="bx--row">
              <div className="bx--col">
                <Search
                  onChange={this.handleSearch}
                  id="search"
                  placeholder={i18n.t('adminDashboard.searchText')}
                  labelText={i18n.t('adminDashboard.searchLabel')}
                  onKeyPress={this.handleSearch}
                />
              </div>
              {isPortalAdmin() ? (
                <div className="bx--col">
                  <div>
                    <AddPartnerModal
                      serviceUrl={this.props.serviceUrl}
                      updateCustomerList={this.updateCustomerList}
                    />
                    <AddCustomerModal serviceUrl={this.props.serviceUrl} updateCustomerList={this.updateCustomerList} />
                    <AddProjectModal
                      serviceUrl={this.props.serviceUrl}
                      updateCustomerList={this.updateCustomerList}
                      allCustomers={this.state.customers}
                    />
                  </div>
                </div>
              ) : null}
            </div>
          </Tile>
        ) : null}

        <div className="form-container">
          <Accordion>
            {Object.keys(this.state.customers).length !== 0
              ? this.state.filteredCustomers.map((customer, index) => {
                  // Pagination for Admin and Support roles (5 items per page)
                  var indexOfLastItem = (this.state.currentPage + 1) * 5 - 1;
                  var firstIndexOfCurrentPage = this.state.currentPage * 5;
                  var accordionOpened = this.state.customers.length === 1;

                  if (isPortalUser()) {
                    if (index >= firstIndexOfCurrentPage && index <= indexOfLastItem) {
                      return (
                        <CustomerAccordian
                          key={customer.id}
                          serviceUrl={this.props.serviceUrl}
                          customerId={customer.id}
                          title={customer.name}
                          updateCustomerList={this.updateCustomerList}
                          locale={this.props.locale}
                          accordionOpened={accordionOpened}
                        />
                      );
                    } else {
                      return null;
                    }
                  } else {
                    return null;
                  }
                })
              : null}
          </Accordion>
          <PaginationNav {...props()} className="pagination-right" />
        </div>
      </div>
    );
  }
}

export default withKeycloak(AdminDashboard);
