import React from 'react';
import i18n from '../../i18n';
import {Accordion, InlineLoading, PaginationNav, Search, Tile} from 'carbon-components-react';
import AddCustomerModal from './AddCustomerModal';
import AddPartnerModal from './AddPartnerModal';
import withKeycloak from '../../auth/withKeycloak';
import {apiCustomersGet} from '../../api/customers';
import CustomerAccordian from '../Customer/CustomerAccordian';
import {
  authenticationChanged,
  isPortalAdmin,
  isPortalSupport,
  isPortalPartner,
  isPortalUser,
  isAuthenticated,
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
      loading: true
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
      let customers = {};
      try {
        customers = await apiCustomersGet(this.props.serviceUrl);
      } catch (err) {
        console.log(err);
      }

      this.setState({
        customers: customers.data ? customers.data : {},
        filteredCustomers: customers.data ? customers.data : {},
        loading: false
      });
    }
  }

  handleSearch = event => {
    if (event.key === 'Enter') {
      //Note: should refactor this to perform filtering in db
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
    const customerCount = Object.keys(this.state.customers).length;

    return (
      <div className="admin-dashboard">
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
                    <AddPartnerModal serviceUrl={this.props.serviceUrl} updateCustomerList={this.updateCustomerList}/>
                    <AddCustomerModal serviceUrl={this.props.serviceUrl} updateCustomerList={this.updateCustomerList}/>
                  </div>
                </div>
              ) : null}
            </div>
          </Tile>
        ) : null}

        {this.state.loading && <InlineLoading/>}
        {!this.state.loading && (
          <div className="form-container">
            <Accordion>
              {(customerCount !== 0)
                ? this.state.filteredCustomers.map((customer, index) => {
                  //Pagination for Admin and Support roles (5 items per page)
                  //Note: eventually this should be pushed down into paginated microservice calls
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
            {customerCount > 1 && (
              <PaginationNav {...props()} className="pagination-right"/>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default withKeycloak(AdminDashboard);
