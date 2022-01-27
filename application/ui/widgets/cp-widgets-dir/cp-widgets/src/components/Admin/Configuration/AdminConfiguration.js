import React from 'react';
import i18n from '../../../i18n';
import { Accordion, AccordionItem, Tile } from 'carbon-components-react';
import TicketingSystem from './TicketingSystem';
import ProductVersion from './ProductVersion';
import {authenticationChanged, isAuthenticated, isPortalAdmin} from '../../../api/helpers';
import withKeycloak from '../../../auth/withKeycloak';
import Breadcrumbs from "../../Breadcrumbs/Breadcrumbs";
import TicketTypeConfiguration from './TicketTypeConfiguration';
import ServiceSubLevelConfiguration from './ServiceSubLevelConfiguration';
import { apiTicketingSystemConfigResourceGet } from '../../../api/manageFieldConfigurations';

class AdminConfiguration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      refinedTicketType : [],
      refinedSubLevel: [],
      adminConfig: []
    };
  }

  componentDidMount() {
    if (isAuthenticated(this.props)) {
      this.setState({
        loading: false,
      });
      this.getTicketAndSubLevel();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (authenticationChanged(this.props, prevProps)) {
      this.setState({
        loading: false,
      });
    }
    if (prevState.refinedTicketType.length !== this.state.refinedTicketType.length || prevState.refinedSubLevel.length !== this.state.refinedSubLevel.length) {
      this.initAdminConfig()
    }
  }

  initAdminConfig = () => {
    const setAdminConfig = [
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
      {
        label: (
          <div>
            <p className="title">{i18n.t('adminConfig.manageFieldConfigurations.title')}</p>
            <p className="desc">{i18n.t('adminConfig.manageFieldConfigurations.manageFieldConfigurationsDesc')}</p>
          </div>
        ),
        content: (
          <>
            <TicketTypeConfiguration ticketType={this.state.refinedTicketType} />
            <ServiceSubLevelConfiguration subLevel={this.state.refinedSubLevel} />
          </>
        )
      },
    ];
    this.setState({ adminConfig: setAdminConfig })
  }

  getTicketAndSubLevel = async () => {
    try {
      const { data: ticketTypesAndSubLevelsData } = await apiTicketingSystemConfigResourceGet(this.props.serviceUrl);
      let refinedTicketType = [];
      let refinedSubLevel = [];
      if (ticketTypesAndSubLevelsData) {
        ticketTypesAndSubLevelsData.map(ticketTypeAndSubLevel => {
          if (ticketTypeAndSubLevel.ticketType) {
            refinedTicketType.push({ id: ticketTypeAndSubLevel.id, ticketType: ticketTypeAndSubLevel.ticketType })
          }
          if (ticketTypeAndSubLevel.subscriptionLevel) {
            refinedSubLevel.push({ id: ticketTypeAndSubLevel.id, ticketType: ticketTypeAndSubLevel.subscriptionLevel })
          }
        })
        this.setState({ refinedTicketType })
        this.setState({ refinedSubLevel })
      }
    } catch (error) {
      console.log('Error: ', error)
    }
  }

  render() {
    if (!this.state.loading) {
      // Authorized
      if (isPortalAdmin()) {
        return (
          <div id="entando-customer-portal">
            <Breadcrumbs locale={this.props.locale}/>
            <div className="form-container">
              <Tile>
                <p className="title">{i18n.t('adminConfig.title')}</p>
                <p className="desc">{i18n.t('adminConfig.desc')}</p>
              </Tile>
              <Accordion>
                {this.state.adminConfig.map((item, index) => (
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
