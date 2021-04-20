import React from 'react';
import i18n from '../../../i18n';
import { Accordion, AccordionItem, Tile } from 'carbon-components-react';
import TicketingSystem from './TicketingSystem';
import ProductVersion from './ProductVersion';
import { isPortalAdmin } from '../../../api/helpers';
import withKeycloak from '../../../auth/withKeycloak';

class AdminConfiguration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
    this.adminConfig = [
      {
        label: (
          <div>
            <p className="title">{i18n.t('adminConfig.integrationTicketingSystem.title')}</p>
            <p className="desc">{i18n.t('adminConfig.integrationTicketingSystem.desc')}</p>
          </div>
        ),
        content: <TicketingSystem serviceUrl={this.props.serviceUrl} />,
      },
      {
        label: (
          <div>
            <p className="title">{i18n.t('adminConfig.manageProductVersion.title')}</p>
            <p className="desc">{i18n.t('adminConfig.manageProductVersion.desc')}</p>
          </div>
        ),
        content: <ProductVersion serviceUrl={this.props.serviceUrl} />,
      },
    ];
  }

  componentDidMount() {
    const { keycloak } = this.props;
    const authenticated = keycloak.initialized && keycloak.authenticated;

    if (authenticated) {
      this.setState({
        loading: false,
      });
    }
  }

  componentDidUpdate(prevProps) {
    const { keycloak } = this.props;
    const authenticated = keycloak.initialized && keycloak.authenticated;

    const changedAuth = prevProps.keycloak.authenticated !== authenticated;

    if (authenticated && changedAuth) {
      this.setState({
        loading: false,
      });
    }
  }

  render() {
    if (!this.state.loading) {
      // Authorized
      if (isPortalAdmin()) {
        return (
          <div>
            <h3 className="pageTitle">{i18n.t('adminDashboard.adminTitle')}</h3>
            <div className="form-container">
              <Tile>
                <p className="title">{i18n.t('adminConfig.title')}</p>
                <p className="desc">{i18n.t('adminConfig.desc')}</p>
              </Tile>
              <Accordion>
                {this.adminConfig.map((item, index) => (
                  <AccordionItem key={index.toString()} index={index} title={item.label} description={item.description}>
                    <div>{item.content}</div>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        );
      }
      // Unauthorized
      else {
        return <p>{i18n.t('userMessages.unauthorized')}</p>;
      }
    }
    // Loading
    else {
      return null;
    }
  }
}
export default withKeycloak(AdminConfiguration);
