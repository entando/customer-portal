import React from 'react';
import { Accordion, AccordionItem, Search, Tile} from 'carbon-components-react';
import CustomTable from '../Customer/customDataTable';
import AddCustomerModal from './AddCustomerModal';
import { AuthenticatedView, UnauthenticatedView } from '../../auth/KeycloakViews';
import withKeycloak from '../../auth/withKeycloak';

const customer = [
    {
        label: <h4>Blue Cross Subscription</h4>,
        content: <CustomTable />
    },
    {
        label: <h4>Ford</h4>,
        content: <CustomTable />
    },
    {
        label: <h4>Veriday</h4>,
        content: <CustomTable />
    }
]

//const { keycloak } = props;
//const authenticated = keycloak.initialized && keycloak.authenticated;

const AdminDashboard = (props) => (
    <>
    <AuthenticatedView keycloak={props.keycloak}>
    <div className="admin-dashboard">
        <Tile>
            <h4>All Customers</h4><br/>
            <div className="bx--grid">
                <div className="bx--row">
                    <div className="bx--col">
                        <Search id="search" placeHolderText="Which customer are you looking for?" />
                    </div>
                    <div className="bx--col">
                        <AddCustomerModal/> 
                    </div>
                </div>
            </div>
        </Tile>  
        
        <div className="form-container">
            <Accordion>
                {customer.map((item, index) => (
                    <AccordionItem index={index} title={item.label}>
                        <p>{item.content}</p>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    </div>
    </AuthenticatedView>
    <UnauthenticatedView keycloak={props.keycloak}>
        <p>Unauthenticated</p>
    </UnauthenticatedView>
    </>
);

export default withKeycloak(AdminDashboard);
