import React from 'react';
import TicketList from './TicketList';
import { Tile } from 'carbon-components-react';
import { apiSubscriptionGet } from '../../api/subscriptions'
import withKeycloak from '../../auth/withKeycloak';

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
            subscription: ''
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

    componentDidMount(){
        this.getSubscription();
    }

    componentDidUpdate(prevProps) {
        const { keycloak } = this.props;
        const authenticated = keycloak.initialized && keycloak.authenticated;
    
        const changedAuth = prevProps.keycloak.authenticated !== authenticated;
    
        if (authenticated && changedAuth) {
          this.getSubscription();
        }
      }

    render() {
        const { description, commitment, type, quantityRequest, components, level, startDate, endDate, license } = subscriptionData
        return (
            <div className="subscription-details">
                {Object.keys(this.state.subscription).length !== 0 ? <div><p>Project Id: {this.state.subscription.data.project.id }</p>
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
                                <p><strong>Start Date:</strong> {startDate}</p>
                                <p><strong>End Date:</strong> {endDate}</p>
                                <p><strong>License:</strong> {license}</p>
                            </div>
                        </div>
                    </div>
                </Tile>
                <br/>
                <TicketList projectId={this.props.match.params.id} serviceUrl={this.props.serviceUrl}/>
                </div>
                : null }
            </div>
        )
    }
}

export default withKeycloak(Subscription);