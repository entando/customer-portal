import React from 'react';
import { AccordionItem } from 'carbon-components-react';
import withKeycloak from '../../auth/withKeycloak';
import { apiGetCustomersProjects } from '../../api/customers';
import { apiGetProjectsUsers } from '../../api/projects';
import CustomTable from './customDataTable';
import CustomerDetails from './customerDetails';
import { hasKeycloakClientRole } from '../../api/helpers';

class CustomerAccordian extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            projects: {},
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
            const projects = await apiGetCustomersProjects(this.props.serviceUrl, id);

            this.setState({
                projects: projects.data
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
                        <CustomTable serviceUrl={this.props.serviceUrl} customerNumber={this.props.customerNumber} />
                    </AccordionItem></div> 
            </div>
        )
    }
}

export default withKeycloak(CustomerAccordian);