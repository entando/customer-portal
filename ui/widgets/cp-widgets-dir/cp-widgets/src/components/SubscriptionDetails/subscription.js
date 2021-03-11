import React from 'react';
import TicketList from './TicketList';
import { Tile } from 'carbon-components-react';
import { apiSubscriptionGet } from '../../api/subscriptions'
import withKeycloak from '../../auth/withKeycloak';
import { apiUsersGet } from '../../api/portalusers';
import { apiProjectGet } from '../../api/projects'; 

const subscriptionData = {
    description: 'Entando Product Support Subscription Suplier Portal',
    commitment: 'Leonardo',
    type: 'Product Support Subscription Entando Platform',
    quantityRequest: '1(8 Core)',
    components: '',
    level: 'Gold',
    startDate: 'May 2019',
    endDate: 'May 2020',
    license: 'Free Commercial Open Source',
};

class Subscription extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            subscription: '',
            users: {},
            role: 'Admin',
            project: ''
        }
    }

    async getSubscription() {
        const { t, keycloak } = this.props;
        const authenticated = keycloak.initialized && keycloak.authenticated;
        if (authenticated) {
            const subscription = await apiSubscriptionGet(this.props.serviceUrl, this.props.match.params.id);
            var project = '';
            if (subscription.data.project) {
                project = await apiProjectGet(this.props.serviceUrl, subscription.data.project.id)
            }
            this.setState({
                subscription: subscription,
                project: project
            })
        }
    }

    async getPortalUsers() {
        const { t, keycloak } = this.props;
        const authenticated = keycloak.initialized && keycloak.authenticated;
        if (authenticated) {
            const users = await apiUsersGet(this.props.serviceUrl)

            this.setState({
                users: users
            })
        }
    }

    async getProject(id) {
        const { t, keycloak } = this.props;
        const authenticated = keycloak.initialized && keycloak.authenticated;
        if (authenticated) {
            const project =  await apiProjectGet(this.props.serviceUrl, id)

            this.setState({
                project: project
            })
        }
    }

    checkRole() {
        const { t, keycloak } = this.props;
        const authenticated = keycloak.initialized && keycloak.authenticated;

        var role = ''
        if (keycloak.realmAccess) {
            for (var i = 0; i < keycloak.tokenParsed.roles.length; i++) {
              if (keycloak.tokenParsed.roles[i] == "ROLE_ADMIN") {
                role = 'Admin'
                break;
              }
              else if (keycloak.tokenParsed.roles[i] == "ROLE_SUPPORT") {
                role = 'Support'
              }
              else if (keycloak.tokenParsed.roles[i] == "ROLE_PARTNER") {
                role = 'Partner'
              }
              else if (keycloak.tokenParsed.roles[i] == "ROLE_CUSTOMER") {
                role = 'Customer'
              }
            }
            this.setState({
                role: role
            })
        }
    }

    componentDidMount(){
        const { keycloak } = this.props;
        const authenticated = keycloak.initialized && keycloak.authenticated;

        this.getSubscription();
        if (this.state.subscription !== '') {
            this.getProject(this.state.subscription.project.id);
        }
        this.checkRole();
        this.getPortalUsers();
    }

    componentDidUpdate(prevProps) {
        const { keycloak } = this.props;
        const authenticated = keycloak.initialized && keycloak.authenticated;
    
        const changedAuth = prevProps.keycloak.authenticated !== authenticated;
    
        if (authenticated && changedAuth) {
          this.getSubscription();
          if (this.state.subscription !== '') {
            this.getProject(this.state.subscription.project.id);
          }
          this.checkRole();
          this.getPortalUsers();
        }
      }

    render() {
        const { description, commitment, type, quantityRequest, components, level, startDate, endDate, license } = subscriptionData
        var { t, keycloak } = this.props;
        var authenticated = keycloak.initialized && keycloak.authenticated;

        if (this.state.role === 'Admin' || this.state.role === 'Support' || this.state.role === 'Partner' || this.state.role === 'Customer') {

            // wait for data from api
            if (Object.keys(this.state.users).length !== 0 && Object.keys(this.state.subscription).length !== 0) {
                // Looping through users and checking if this user is mapped to this project or if user is admin/support
                for (var i = 0; i < this.state.users.data.length; i++) {
                    if ((keycloak.tokenParsed.preferred_username === this.state.users.data[i].username 
                        && this.state.users.data[i].project.id === this.state.subscription.data.project.id) 
                        || (this.state.role === 'Admin' || this.state.role === 'Support')) {
                            return (
                                <div className="subscription-details">
                                    {Object.keys(this.state.subscription).length !== 0 ? <div><p>Project Id: {this.state.subscription.data.project.id}</p>
                                    <Tile>
                                        <div className="bx--grid">
                                            <div className="bx--row">
                                                <div className="bx--col">
                                                    <p><strong>Description:</strong> {this.state.subscription.data.project.description}</p>
                                                    <p><strong>Commitment:</strong>
                                                    {this.state.project.data !== '' && Object.keys(this.state.project.data.partners).length !== 0 ? 
                                                    
                                                    <>
                                                        {this.state.project.data.partners.map(partner => (
                                                            <> {partner.name} </>
                                                        ))}
                                                    </>
                                                    : <> None </>}
                                                    </p>
                                                    <p><strong>Type:</strong> {type}</p>
                                                    <p><strong>Quantity Request:</strong> {quantityRequest}</p>
                                                    <p><strong>Components:</strong> {components}</p>
                                                </div>
                                                <div className="bx--col">
                                                    <p><strong>Level:</strong> {this.state.subscription.data.level}</p>
                                                    <p><strong>Start Date:</strong> {String(new Date(this.state.subscription.data.startDate))}</p>
                                                    <p><strong>End Date:</strong> {String(new Date(new Date(this.state.subscription.data.startDate).setMonth(new Date(this.state.subscription.data.startDate).getMonth() + this.state.subscription.data.lengthInMonths)))}</p>
                                                    <p><strong>License:</strong> {license}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </Tile>
                                    <br/>
                                    <TicketList projectId={this.state.subscription.data.project.id} serviceUrl={this.props.serviceUrl}/>
                                    </div>
                                    : null }
                                </div>
                            )
                    }
                    
                }
            }
            return (
                <p>No data</p>
            )
        }
        else {
            return (
                <p>Incorrect role</p>
            )
        }
    }
}

export default withKeycloak(Subscription);