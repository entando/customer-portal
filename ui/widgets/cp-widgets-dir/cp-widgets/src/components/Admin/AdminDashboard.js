import React from 'react';
import i18n from '../../i18n';
import { Accordion, AccordionItem, PaginationNav, Search, Tile, Pagination} from 'carbon-components-react';
import AddCustomerModal from './AddCustomerModal';
import AddPartnerModal from './AddPartnerModal';
import AddProjectModal from './AddProjectModal'
import withKeycloak from '../../auth/withKeycloak';
import { apiCustomersGet } from '../../api/customers';
import CustomerAccordian from '../Customer/CustomerAccordian';
import { number } from 'prop-types';

class AdminDashboard extends React.Component {
    constructor() {
        super();
        this.state = {
            customers: {},
            customersProjects: {},
            role: '',
            filteredCustomers: {},
            currentPage: 0
        }
    }

    componentDidMount(){
        this.getCustomer();
    }

    componentDidUpdate(prevProps) {
        const { keycloak } = this.props;
        const authenticated = keycloak.initialized && keycloak.authenticated;
    
        const changedAuth = prevProps.keycloak.authenticated !== authenticated;
    
        if (authenticated && changedAuth) {
          this.getCustomer();
        }
      }


    async getCustomer() {
        const { t, keycloak } = this.props;
        const authenticated = keycloak.initialized && keycloak.authenticated;
        if (authenticated) {
            const customers = await apiCustomersGet(this.props.serviceUrl);

            this.setState({
                customers: customers.data,
                filteredCustomers: customers.data
            })
        }
    }

    handleSearch = (event) => {
        if (event.key === 'Enter') {
            const newFilteredState = this.state.customers.filter(customer => customer.name.toLowerCase().includes(event.target.value.toLowerCase()))
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
                <h3 className="pageTitle">{i18n.t('adminDashboard.title')} {this.props.role} {i18n.t('adminDashboard.view')}</h3>
            {this.props.role === 'Admin' || this.props.role === 'Support' || this.props.role === 'Partner' ?
                <Tile>
                    <p className="title">{i18n.t('adminDashboard.allCustomers')}</p>
                    <div className="bx--row">
                        <div className="bx--col">
                            <Search onChange={this.handleSearch} id="search" placeHolderText={i18n.t('adminDashboard.searchText')} onKeyPress={this.handleSearch}/>
                        </div>
                        {this.props.role === 'Admin' ?
                        <div className="bx--col">
                            <div>
                                <AddPartnerModal serviceUrl={this.props.serviceUrl} />
                                <AddCustomerModal serviceUrl={this.props.serviceUrl} />
                                <AddProjectModal serviceUrl={this.props.serviceUrl} />
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
                            
                            if (this.props.role === 'Admin' || this.props.role === 'Support') {
                                if (index >= firstIndexOfCurrentPage && index <= indexOfLastItem) {
                                    return(
                                        <CustomerAccordian key={customer.id} role={this.props.role} serviceUrl={this.props.serviceUrl} customerNumber={customer.id} title={customer.name}/>
                                    )
                                }
                                else {
                                    return(null)
                                }
                            }
                            // For Partner / Customer roles just show what they have access to
                            else {
                                
                                return(
                                    <CustomerAccordian key={customer.id} role={this.props.role} serviceUrl={this.props.serviceUrl} customerNumber={customer.id} title={customer.name}/>
                                )
                            }
                        }) : null}
                    </Accordion>
                    {(this.props.role === 'Admin' || this.props.role === 'Support') ? 
                    <PaginationNav {...props()} cssClass='pagination-right' /> : <PaginationNav cssClass='pagination-right' />}
                </div>
            </div>
        )
    }
    
}

export default withKeycloak(AdminDashboard);
