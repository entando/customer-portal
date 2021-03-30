import React from 'react';
import { AccordionItem } from 'carbon-components-react';
import withKeycloak from '../../auth/withKeycloak';
import { apiCustomerGet, apiGetCustomersProjects,  apiGetMyCustomersProjects } from '../../api/customers';
import { apiGetProjectsUsers } from '../../api/projects';
import CustomTable from './customDataTable';
import CustomerDetails from './customerDetails';
import { hasKeycloakClientRole } from '../../api/helpers';
import EditCustomerModal from '../Admin/EditCustomerModal';

class CustomerAccordian extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            projects: {},
            customer: {},
            authenticated: false
        }
    }

    componentDidMount(){
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
        const { t, keycloak } = this.props;
        const authenticated = keycloak.initialized && keycloak.authenticated;
        if (authenticated) {
            const customer = await apiCustomerGet(this.props.serviceUrl, id);

            var projects;
            if (hasKeycloakClientRole('ROLE_ADMIN') || hasKeycloakClientRole('ROLE_SUPPORT')) {
                projects = await apiGetCustomersProjects(this.props.serviceUrl, id);
            }
            else {
                projects = await apiGetMyCustomersProjects(this.props.serviceUrl, id);
            }

            this.setState({
                projects: projects.data,
                customer: customer.data
            })
        }
    }

    render() {
        var { t, keycloak } = this.props;
        var authenticated = keycloak.initialized && keycloak.authenticated;

        return(
            <div>
                <div>
                    {hasKeycloakClientRole('ROLE_CUSTOMER') ? 
                        <CustomerDetails serviceUrl={this.props.serviceUrl} customerNumber={this.props.customerNumber} /> : null 
                    }
                    <AccordionItem title={this.props.title}>
                        {hasKeycloakClientRole('ROLE_ADMIN') ?
                            <EditCustomerModal serviceUrl={this.props.serviceUrl} customer={this.state.customer} key={this.state.customer.id} updateCustomerList={this.props.updateCustomerList}/>  : null
                        }
                        <CustomTable serviceUrl={this.props.serviceUrl} customerNumber={this.props.customerNumber} updateCustomerList={this.props.updateCustomerList} locale={this.props.locale} />
                    </AccordionItem>
                </div> 
            </div>
        )
    }
}

export default withKeycloak(CustomerAccordian);