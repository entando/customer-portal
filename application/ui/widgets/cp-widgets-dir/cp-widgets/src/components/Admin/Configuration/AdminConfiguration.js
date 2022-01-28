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

  getTicketAndSubLevel = async () => {
    try {
      const { data: ticketTypesAndSubLevelsData } = await apiTicketingSystemConfigResourceGet(this.props.serviceUrl);
      if (ticketTypesAndSubLevelsData.length) {
        // FIXME: FOR NOW WE ARE ALLWAYS USING ticketTypesAndSubLevelsData.length - 1 OR ticketTypesAndSubLevelsData[0]
        let refinedTicketType = [];
        let refinedSubLevel = [];
        if (ticketTypesAndSubLevelsData[0].ticketType.length) {
          refinedTicketType = JSON.parse(ticketTypesAndSubLevelsData[0].ticketType);
        }
        if (ticketTypesAndSubLevelsData[0].subscriptionLevel.length) {
          refinedSubLevel = JSON.parse(ticketTypesAndSubLevelsData[0].subscriptionLevel)
        }
        this.setState({ refinedTicketType })
        this.setState({ refinedSubLevel })
      }
    } catch (error) {
      console.log('Error: ', error)
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
            <TicketTypeConfiguration serviceUrl={this.props.serviceUrl} ticketType={this.state.refinedTicketType} getTicketAndSubLevel={this.getTicketAndSubLevel} />
            <ServiceSubLevelConfiguration serviceUrl={this.props.serviceUrl} subLevel={this.state.refinedSubLevel} getTicketAndSubLevel={this.getTicketAndSubLevel} />
          </>
        )
      },
    ];
    this.setState({ adminConfig: setAdminConfig })
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
