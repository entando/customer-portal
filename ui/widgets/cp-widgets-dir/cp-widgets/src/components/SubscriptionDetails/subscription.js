import React from 'react';
import TicketList from './TicketList';
import { Tile } from 'carbon-components-react';
import { apiSubscriptionGet } from '../../api/subscriptions'
import withKeycloak from '../../auth/withKeycloak';
import { apiUsersGet } from '../../api/portalusers';

const subscriptionData = {
    description: 'Entando Product Support Subscription Suplier Portal',
    commitment: 'Leonardo',
    type: 'Product Support Subscription Entando Platform',
    quantityRequest: '1(8 Crore)',
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
            role: 'admin'
        }
    }

    async getSubscription() {
        const { t, keycloak } = this.props;
        const authenticated = keycloak.initialized && keycloak.authenticated;
        if (authenticated) {
            const subscription = await apiSubscriptionGet(this.props.serviceUrl, this.props.match.params.id);

            this.setState({
                subscription: subscription
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

    checkRole() {
        const { t, keycloak } = this.props;
        const authenticated = keycloak.initialized && keycloak.authenticated;

        var role = ''
        if (keycloak.realmAccess) {
            for (var i = 0; i < keycloak.tokenParsed.roles.length; i++) {
              if (keycloak.tokenParsed.roles[i] == "ROLE_ADMIN") {
                role = 'admin'
                break;
              }
              else if (keycloak.tokenParsed.roles[i] == "ROLE_SUPPORT") {
                role = 'support'
              }
              else if (keycloak.tokenParsed.roles[i] == "ROLE_PARTNER") {
                role = 'partner'
              }
              else if (keycloak.tokenParsed.roles[i] == "ROLE_CUSTOMER") {
                role = 'customer'
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
        this.checkRole();
        this.getPortalUsers();
    }

    componentDidUpdate(prevProps) {
        const { keycloak } = this.props;
        const authenticated = keycloak.initialized && keycloak.authenticated;
    
        const changedAuth = prevProps.keycloak.authenticated !== authenticated;
    
        if (authenticated && changedAuth) {
          this.getSubscription();
          this.checkRole();
          this.getPortalUsers();
        }
      }

    render() {
        const { description, commitment, type, quantityRequest, components, level, startDate, endDate, license } = subscriptionData
        var { t, keycloak } = this.props;
        var authenticated = keycloak.initialized && keycloak.authenticated;

        if (this.state.role === 'admin' || this.state.role === 'support' || this.state.role === 'partner' || this.state.role === 'customer') {
            return (
                <div className="subscription-details">
                    {Object.keys(this.state.subscription).length !== 0 ? <div><p>Project Id: {this.state.subscription.data.project.id}</p>
                    <Tile>
                        <div className="bx--grid">
                            <div className="bx--row">
                                <div className="bx--col">
                                    <p><strong>Description:</strong> {this.state.subscription.data.project.description}</p>
                                    <p><strong>Commitment:</strong> {commitment}</p>
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
        else {
            return (
                <p>Incorrect role</p>
            )
        }
    }
}

export default withKeycloak(Subscription);