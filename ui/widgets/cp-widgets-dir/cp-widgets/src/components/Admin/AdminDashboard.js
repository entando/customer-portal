import React from 'react';
import i18n from '../../i18n';
import { Accordion, AccordionItem, PaginationNav, Search, Tile, Pagination} from 'carbon-components-react';
import AddCustomerModal from './AddCustomerModal';
import AddPartnerModal from './AddPartnerModal';
import AddProjectModal from './AddProjectModal'
import withKeycloak from '../../auth/withKeycloak';
import { apiAdminCustomersGet, apiCustomersGet, apiMyCustomersGet } from '../../api/customers';
import CustomerAccordian from '../Customer/CustomerAccordian';
import { number } from 'prop-types';
import { hasKeycloakClientRole } from '../../api/helpers';
import SubscriptionForm from '../Forms/SubscriptionForm';
import ManageUser from '../Admin/ManageUser/ManageUser';
class AdminDashboard extends React.Component {
    constructor() {
        super();
        this.state = {
            customers: {},
            customersProjects: {},
            role: '',
            filteredCustomers: {},
            currentPage: 0,
            test: ''
        }
    }

    componentDidMount(){
        this.getCustomers();
    }

    componentDidUpdate(prevProps) {
        const { t, keycloak } = this.props;
        const authenticated = keycloak.initialized && keycloak.authenticated;
    
        const changedAuth = prevProps.keycloak.authenticated !== authenticated;
    
        if (authenticated && changedAuth) {
          this.getCustomers();
        }
      }


    async getCustomers() {
        const { t, keycloak } = this.props;
        const authenticated = keycloak.initialized && keycloak.authenticated;
        if (authenticated) {
            var customers;
            if (hasKeycloakClientRole('ROLE_ADMIN') || hasKeycloakClientRole('ROLE_SUPPORT')) {
                customers = await apiAdminCustomersGet(this.props.serviceUrl);
            }
            else {
                customers = await apiMyCustomersGet(this.props.serviceUrl);
            }

            this.setState({
                customers: customers.data,
                filteredCustomers: customers.data
            })
        }
    }

    handleSearch = (event) => {
        if (event.key === 'Enter') {
            const newFilteredState = this.state.customers.filter(customer => customer.name.toLowerCase().startsWith(event.target.value.toLowerCase()))
            this.setState({
                filteredCustomers: newFilteredState,
                currentPage: 0
            })
        }
        else {
            if (event.target.value === '' || event.target.value === undefined) {
                this.setState({
                    filteredCustomers: this.state.customers
                })
            }
        }
        this.forceUpdate();
    }

    updateCustomerList = () => {
        this.getCustomers();
    }

    render(){
        var numberOfPages = 1;
        if (Object.keys(this.state.filteredCustomers).length !== 0) {
            numberOfPages = Math.ceil(this.state.filteredCustomers.length / 5);
        }
        else {
            numberOfPages = 1;
        }
        
        const props = () => ({
            loop: Boolean(false),
            page: Number(this.state.currentPage),
            totalItems: Number(numberOfPages),
            itemsShown: Number(1),
            onChange: (event) => this.setState({currentPage: event}),
        });

        return(
            <div className="admin-dashboard">
                {hasKeycloakClientRole('ROLE_ADMIN') ? 
                    <h3 className="pageTitle">{i18n.t('adminDashboard.adminTitle')}</h3> : 
                hasKeycloakClientRole('ROLE_SUPPORT') ? 
                    <h3 className="pageTitle">{i18n.t('adminDashboard.supportTitle')}</h3> : 
                hasKeycloakClientRole('ROLE_CUSTOMER') ? 
                    <h3 className="pageTitle">{i18n.t('adminDashboard.customerTitle')}</h3> : 
                hasKeycloakClientRole('ROLE_PARTNER') ? 
                    <h3 className="pageTitle">{i18n.t('adminDashboard.partnerTitle')}</h3> : 
                null}
            {hasKeycloakClientRole('ROLE_ADMIN') || hasKeycloakClientRole('ROLE_SUPPORT') || hasKeycloakClientRole('ROLE_PARTNER') ?
                <Tile>
                    <p className="title">{i18n.t('adminDashboard.allCustomers')}</p>
                    <div className="bx--row">
                        <div className="bx--col">
                            <Search onChange={this.handleSearch} id="search" placeHolderText={i18n.t('adminDashboard.searchText')} onKeyPress={this.handleSearch}/>
                        </div>
                        {hasKeycloakClientRole('ROLE_ADMIN') ?
                        <div className="bx--col">
                            
                            <div>
                                <AddPartnerModal serviceUrl={this.props.serviceUrl} updateCustomerList={this.updateCustomerList} />
                                <AddCustomerModal serviceUrl={this.props.serviceUrl} updateCustomerList={this.updateCustomerList} />
                                <AddProjectModal serviceUrl={this.props.serviceUrl} updateCustomerList={this.updateCustomerList} />
                            </div>
                        </div> : null}
                    </div>
                </Tile>  
                : null
            }
                    
                <div className="form-container">
                    <Accordion>
                        {Object.keys(this.state.customers).length !== 0 ? this.state.filteredCustomers.map((customer, index) => {
                            // Pagination for Admin and Support roles (5 items per page)
                            var indexOfLastItem = ((this.state.currentPage + 1) * 5) - 1;
                            var firstIndexOfCurrentPage = this.state.currentPage * 5;
                            
                            if (hasKeycloakClientRole('ROLE_ADMIN') || hasKeycloakClientRole('ROLE_SUPPORT') || hasKeycloakClientRole('ROLE_CUSTOMER') || hasKeycloakClientRole('ROLE_PARTNER')) {
                                if (index >= firstIndexOfCurrentPage && index <= indexOfLastItem) {
                                    return(
                                        <CustomerAccordian key={customer.id} serviceUrl={this.props.serviceUrl} customerNumber={customer.id} title={customer.name} updateCustomerList={this.updateCustomerList} locale={this.props.locale}/>
                                    )
                                }
                                else {
                                    return(null)
                                }
                            }
                            else {
                                return(null)
                            }
                        }) : null}
                    </Accordion>
                    <PaginationNav {...props()} cssClass='pagination-right' />
                </div>
            </div>
        )
    }
    
}

export default withKeycloak(AdminDashboard);