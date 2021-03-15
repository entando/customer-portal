import React from 'react';
import { Accordion, AccordionItem, PaginationNav, Search, Tile} from 'carbon-components-react';
import AddCustomerModal from './AddCustomerModal';
import AddPartnerModal from './AddPartnerModal';
import AddProjectModal from './AddProjectModal'
import withKeycloak from '../../auth/withKeycloak';
import { apiCustomersGet } from '../../api/customers';
import CustomerAccordian from '../Customer/CustomerAccordian';

class AdminDashboard extends React.Component {
    constructor() {
        super();
        this.state = {
            customers: {},
            customersProjects: {},
            role: ''
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
                customers: customers
            })
        }
    }

    render(){
        return(
            <div className="admin-dashboard">
                <h3 className="pageTitle">Welcome to Entando {this.props.role} View</h3>
            {this.props.role === 'Admin' || this.props.role === 'Support' || this.props.role === 'Partner' ?
                <Tile>
                    <p className="title">All Customers</p>
                    <div className="bx--row">
                        <div className="bx--col">
                            <Search id="search" placeHolderText="Which customer are you looking for?" />
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
                        {Object.keys(this.state.customers).length !== 0 ? this.state.customers.data.map((customer, index) => {
                                return(
                                    <CustomerAccordian role={this.props.role} serviceUrl={this.props.serviceUrl} customerNumber={customer.id} title={customer.name}/>
                                )
                        }) : null}
                    </Accordion>
                    <PaginationNav cssClass='pagination-right'/>
                </div>
            </div>
        )
    }
    
}

export default withKeycloak(AdminDashboard);
