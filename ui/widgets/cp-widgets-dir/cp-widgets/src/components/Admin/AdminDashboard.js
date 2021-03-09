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
            const customers = await apiProjectsGetForAdmin(this.props.serviceUrl);

            this.setState({
                customers: customers
            })
        }
    }

    render(){
        //console.log(this.state.customers)
        return(
            
            <div className="admin-dashboard">
                <Tile>
                    <h4>All Customers</h4><br/>
                    <div className="bx--grid">
                        <div className="bx--row">
                            <div className="bx--col">
                                <Search id="search" placeHolderText="Which customer are you looking for?" />
                            </div>
                            <div className="bx--col">
                                <AddPartnerModal />
                                <AddCustomerModal serviceUrl={this.props.serviceUrl}/>
                                <AddProjectModal />
                            </div>
                        </div>
                    </div>
                </Tile>  
                
                <div className="form-container">
                    <Accordion>
                        {this.state.customers.data ? Object.entries(this.state.customers.data).map(([key, value], index) => {
                            return(
                            <AccordionItem key={index} index={index} title={key}>
                                <CustomTable serviceUrl={this.props.serviceUrl} customerNumber={value} />
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
