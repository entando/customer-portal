import React from 'react';
import TicketList from './TicketList';
import { Tile } from 'carbon-components-react';
import { apiSubscriptionGet, apiGetMySubscription } from '../../api/subscriptions'
import withKeycloak from '../../auth/withKeycloak';
import { apiUsersGet } from '../../api/portalusers';
import { apiProjectGet } from '../../api/projects'; 
import { hasKeycloakClientRole } from '../../api/helpers';
import EditSubscriptionModal from '../Admin/EditSubscriptionModal';
import i18n from '../../i18n';

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
            subscription: {},
            users: {},
            project: {}
        }
    }

    async getSubscription() {
        const { t, keycloak } = this.props;
        const authenticated = keycloak.initialized && keycloak.authenticated;
        if (authenticated) {
            try {
                var subscription;
                if (hasKeycloakClientRole('ROLE_ADMIN') || hasKeycloakClientRole('ROLE_SUPPORT')) {
                    subscription = await apiSubscriptionGet(this.props.serviceUrl, this.props.match.params.id);
                    var project = '';
                    if (subscription.data.project) {
                        project = await apiProjectGet(this.props.serviceUrl, subscription.data.project.id)
                    }
                }
                else if (hasKeycloakClientRole('ROLE_CUSTOMER') || hasKeycloakClientRole('ROLE_PARTNER')) {
                    subscription = await apiGetMySubscription(this.props.serviceUrl, this.props.match.params.id);
                    var project = '';
                    if (subscription.data.project) {
                        project = await apiProjectGet(this.props.serviceUrl, subscription.data.project.id)
                    }
                }
                this.setState({
                    subscription: subscription,
                    project: project
                })
            }
            catch(err) {
                console.log(err)
            }
        }
    }

    updateSubscription = () => {
        this.getSubscription();
    }

    componentDidMount(){
        const { keycloak } = this.props;
        const authenticated = keycloak.initialized && keycloak.authenticated;

        if (authenticated) {
            if (hasKeycloakClientRole('ROLE_ADMIN') || hasKeycloakClientRole('ROLE_SUPPORT') || hasKeycloakClientRole('ROLE_CUSTOMER') || hasKeycloakClientRole('ROLE_PARTNER')) {
                this.getSubscription();
            }
        }
    }

    componentDidUpdate(prevProps) {
        const { keycloak } = this.props;
        const authenticated = keycloak.initialized && keycloak.authenticated;
    
        const changedAuth = prevProps.keycloak.authenticated !== authenticated;
    
        if (authenticated && changedAuth) {
            if (hasKeycloakClientRole('ROLE_ADMIN') || hasKeycloakClientRole('ROLE_SUPPORT') || hasKeycloakClientRole('ROLE_CUSTOMER') || hasKeycloakClientRole('ROLE_PARTNER')) {
                this.getSubscription();
            }
        }
      }

    render() {
        const { description, commitment, type, quantityRequest, components, level, startDate, endDate, license } = subscriptionData
        var { t, keycloak } = this.props;
        var authenticated = keycloak.initialized && keycloak.authenticated;

        if (Object.keys(this.state.subscription).length !== 0 && Object.keys(this.state.project).length !== 0) {
            return (
                <div className="subscription-details">
                    <div>
                    <Tile>
                        <div className="bx--grid">
                            <div className="bx--row">
                                <div className="bx--col">
                                    <p><strong>{i18n.t('subscriptionDetails.description')}:</strong> {this.state.subscription.data.project.description}</p>
                                    <p><strong>{i18n.t('subscriptionDetails.partners')}:</strong>
                                    {this.state.project.data !== '' && Object.keys(this.state.project.data.partners).length !== 0 ? 
                                        <>
                                            {this.state.project.data.partners.map(partner => (
                                                <> {partner.name} </>
                                            ))}
                                        </>
                                        : <> None </>
                                    }
                                    </p>
                                    <p><strong>{i18n.t('subscriptionDetails.type')}:</strong> {type}</p>
                                    <p><strong>{i18n.t('subscriptionDetails.status')}:</strong> {this.state.subscription.data.status}</p>
                                </div>
                                <div className="bx--col">
                                    <p><strong>{i18n.t('subscriptionDetails.level')}:</strong> {this.state.subscription.data.level}</p>
                                    <p><strong>{i18n.t('subscriptionDetails.startDate')}:</strong> {String(new Date(this.state.subscription.data.startDate).toDateString())}</p>
                                    <p><strong>{i18n.t('subscriptionDetails.endDate')}:</strong> {String(new Date(new Date(this.state.subscription.data.startDate).setMonth(new Date(this.state.subscription.data.startDate).getMonth() + this.state.subscription.data.lengthInMonths)).toDateString())}</p>
                                    <p><strong>{i18n.t('subscriptionDetails.license')}:</strong> {license}</p>
                                </div>
                            </div>
                        </div>
                        {hasKeycloakClientRole('ROLE_ADMIN') ? 
                            <EditSubscriptionModal project={this.state.project.data} subscription={this.state.subscription.data} serviceUrl={this.props.serviceUrl} updateSubscription={this.updateSubscription}/>
                        : null}
                    </Tile>
                    <br/>
                    <TicketList projectId={this.state.project.data.id} serviceUrl={this.props.serviceUrl} />
                    </div>
                </div>
            )
        }
        else {
            return(<p>No Data</p>)
        }
    }
}

export default withKeycloak(Subscription);