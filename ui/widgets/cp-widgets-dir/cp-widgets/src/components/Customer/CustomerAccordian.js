import React from 'react';
import { AccordionItem } from 'carbon-components-react';
import withKeycloak from '../../auth/withKeycloak';
import { apiGetCustomersProjects } from '../../api/customers';
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
            authenticated: false
        }
    }

    componentDidMount(){
        const { keycloak } = this.props;
        const authenticated = keycloak.initialized && keycloak.authenticated;

        if (authenticated) {
            if (hasKeycloakClientRole('ROLE_ADMIN') || hasKeycloakClientRole('ROLE_SUPPORT')) {
                this.setState({
                    authenticated: true
                })
            }
            else {
                this.getCustomersProjects(this.props.customerNumber);
            }
        }
    }

    componentDidUpdate(prevProps) {
        const { keycloak } = this.props;
        const authenticated = keycloak.initialized && keycloak.authenticated;
    
        const changedAuth = prevProps.keycloak.authenticated !== authenticated;
    
        if (authenticated && changedAuth) {
            if (hasKeycloakClientRole('ROLE_ADMIN') || hasKeycloakClientRole('ROLE_SUPPORT')) {
                this.setState({
                    authenticated: true
                })
            }
            else {
                this.getCustomersProjects(this.props.customerNumber);
            }
        }
      }

    async checkPermissions(projects) {
        const { keycloak } = this.props;
        const authenticated = keycloak.initialized && keycloak.authenticated;

        
        for(var i = 0; i < projects.length; i++) {
            const users = await apiGetProjectsUsers(this.props.serviceUrl, projects[i].id)
            for(var j = 0; j < users.data.length; j++) {
                if ((users.data[j].username === keycloak.tokenParsed.preferred_username)) {
                    this.setState({
                        authenticated: true
                    })
                    break;
                }
            }
        }   
    }

    async getCustomersProjects(id) {
        const { t, keycloak } = this.props;
        const authenticated = keycloak.initialized && keycloak.authenticated;
        if (authenticated) {
            const projects = await apiGetCustomersProjects(this.props.serviceUrl, id);
            this.checkPermissions(projects.data);

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
                {this.state.authenticated ?
                <div>
                    {hasKeycloakClientRole('ROLE_CUSTOMER') ? 
                        <CustomerDetails serviceUrl={this.props.serviceUrl} customerNumber={this.props.customerNumber} /> : null 
                    }
                    <AccordionItem title={this.props.title}>
                        <EditCustomerModal/>  <br/> 
                        <CustomTable serviceUrl={this.props.serviceUrl} customerNumber={this.props.customerNumber} />
                    </AccordionItem></div> 
                : null
                }
            </div>
        )
    }
}

export default withKeycloak(CustomerAccordian);