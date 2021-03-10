import React from 'react';
import { Accordion, AccordionItem, PaginationNav, Search, Tile} from 'carbon-components-react';
import CustomTable from '../Customer/customDataTable';
import AddCustomerModal from './AddCustomerModal';
import AddPartnerModal from './AddPartnerModal';
import AddProjectModal from './AddProjectModal'
import withKeycloak from '../../auth/withKeycloak';
import { apiCustomerPost, apiCustomerPut, apiCustomersGet } from '../../api/customers';
import { apiProjectPost, apiProjectPut, apiProjectsGetForAdmin } from '../../api/projects';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Subscription from '../SubscriptionDetails/subscription';

class AdminDashboard extends React.Component {
    constructor() {
        super();
        this.state = {
            customers: "",
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
                <Tile>
                    <p className="title">All Customers</p>
                    <div className="bx--row">
                        <div className="bx--col">
                            <Search id="search" placeHolderText="Which customer are you looking for?" />
                        </div>
                        <div className="bx--col">
                            <AddPartnerModal serviceUrl={this.props.serviceUrl} />
                            <AddCustomerModal serviceUrl={this.props.serviceUrl} />
                            <AddProjectModal serviceUrl={this.props.serviceUrl} />
                        </div>
                    </div>
                </Tile>  
                
                <div className="form-container">
                    <Accordion>
                        {Object.keys(this.state.customers).length !== 0 ? this.state.customers.data.map((customer, index) => {
                            return(
                            <AccordionItem key={index} index={index} title={customer.name}>
                                <CustomTable serviceUrl={this.props.serviceUrl} customerNumber={customer.id} />
                            </AccordionItem>
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
