import React from 'react';
import { Tile } from 'carbon-components-react';
import CustomTable from './customDataTable';
import withKeycloak from '../../auth/withKeycloak';
import { apiAdminCustomerGet, apiGetCustomersProjects } from '../../api/customers';
import { isPortalAdminOrSupport } from '../../api/helpers';
import i18n from '../../i18n';

class CustomerProjectList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            projects: {},
            customer: {}
        }
    }

    async getCustomer() {
        const { keycloak } = this.props;
        const authenticated = keycloak.initialized && keycloak.authenticated;
        if (authenticated) {
            try {
                const customer = await apiAdminCustomerGet(this.props.serviceUrl, this.props.match.params.id);
                const projects = await apiGetCustomersProjects(this.props.serviceUrl, customer.data.id);
                this.setState({
                    customer: customer.data,
                    projects: projects.data,
                    loading: false
                })
            }
            catch(err) {
                console.log(err)
            }
        }
    }

    updateCustomer = () => {
        this.getCustomer();
    }

    componentDidMount(){
        if (isPortalAdminOrSupport()) {
            this.getCustomer();
        }
    }

    componentDidUpdate(prevProps) {
        const { keycloak } = this.props;
        const authenticated = keycloak.initialized && keycloak.authenticated;

        const changedAuth = prevProps.keycloak.authenticated !== authenticated;

        if (authenticated && changedAuth) {
            if (isPortalAdminOrSupport()) {
                this.getCustomer();
            }
        }
      }

    render() {
        if (!this.state.loading) {
            if (isPortalAdminOrSupport()) {
                if (Object.keys(this.state.customer).length !== 0) {
                    return (
                        <div>
                            <Tile>
                                <div className="bx--grid">
                                    <div className="bx--row">
                                        <div className="bx--col">
                                            <p><strong>{i18n.t('customerDetails.id')}: </strong> {this.state.customer.id}</p>
                                            <p><strong>{i18n.t('customerDetails.name')}: </strong> {this.state.customer.name}</p>
                                            <p><strong>{i18n.t('customerDetails.notes')}: </strong> {this.state.customer.notes}</p>
                                        </div>
                                        <div className="bx--col">
                                            <p><strong>{i18n.t('customerDetails.contactName')}: </strong> {this.state.customer.contactName}</p>
                                            <p><strong>{i18n.t('customerDetails.contactPhone')}: </strong> {this.state.customer.contactPhone}</p>
                                            <p><strong>{i18n.t('customerDetails.contactEmail')}: </strong> {this.state.customer.contactEmail}</p>
                                        </div>
                                    </div>
                                </div>
                            </Tile>
                            <CustomTable serviceUrl={this.props.serviceUrl} customerNumber={this.state.customer.id} locale={this.props.locale} />
                        </div>
                    )
                }
                else {
                    return(<p>{i18n.t('userMessages.loading')}...</p>)
                }
            }
            else {
                return(<p>{i18n.t('userMessages.unauthorized')}</p>)
            }
        }
        else {
            return null;
        }
    }
}

export default withKeycloak(CustomerProjectList);
