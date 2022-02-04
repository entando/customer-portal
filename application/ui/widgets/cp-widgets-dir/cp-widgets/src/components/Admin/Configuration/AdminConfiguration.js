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
import ProductNameConfiguration from './ProductNameConfiguration';
import JiraConfiguration from './JiraConfiguration';

class AdminConfiguration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      refinedTicketType : [],
      refinedSubLevel: [],
      adminConfig: [],
      refinedJiraCustomField: [],
      productName: ''
    };
  }

  componentDidMount() {
    if (isAuthenticated(this.props)) {
      this.setState({
        loading: false,
      });
      this.getTicketingSystemConfig();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (authenticationChanged(this.props, prevProps)) {
      this.setState({
        loading: false,
      });
    }
    if (prevState.refinedTicketType.length !== this.state.refinedTicketType.length ||
      prevState.refinedSubLevel.length !== this.state.refinedSubLevel.length ||
      prevState.productName !== this.state.productName) {
      this.initAdminConfig()
    }
  }

  getTicketingSystemConfig = async () => {
    try {
      const { data: ticketTypesAndSubLevelsData } = await apiTicketingSystemConfigResourceGet(this.props.serviceUrl);
      if (ticketTypesAndSubLevelsData && ticketTypesAndSubLevelsData.length) {
        const JIRAKEY = 'jiraCustomField', PRODUCTNAME = 'productName';
        let actualData = ticketTypesAndSubLevelsData[0];
        if (actualData.ticketType) this.setState({ refinedTicketType: JSON.parse(actualData.ticketType) })
        if (actualData.subscriptionLevel) this.setState({ refinedSubLevel: JSON.parse(actualData.subscriptionLevel) })
        if (actualData.hasOwnProperty(JIRAKEY)) {
          let jiraCustomFieldBuilder = [];
          for (let jiraItem in JSON.parse(actualData.jiraCustomField)[0]) {
            jiraCustomFieldBuilder.push({ [jiraItem]: JSON.parse(actualData.jiraCustomField)[0][jiraItem] })
          }
          this.setState({ refinedJiraCustomField: jiraCustomFieldBuilder })
        }
        if (actualData.hasOwnProperty(PRODUCTNAME)) this.setState({ productName: JSON.parse(actualData.productName)[0].name })
      }
    } catch (error) {
      console.error('Error getTicketingSystemConfig: ', error)
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
        content: <div className="admin-config-child"><TicketingSystem serviceUrl={this.props.serviceUrl} /></div>,
      },
      {
        label: (
          <div>
            <p className="title">{i18n.t('adminConfig.manageProductVersion.title')}</p>
            <p className="desc">{i18n.t('adminConfig.manageProductVersion.desc')}</p>
          </div>
        ),
        content: <div className="admin-config-child"><ProductVersion serviceUrl={this.props.serviceUrl} productName={this.state.productName}/></div>,
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
          <div className="admin-config-child">
            <TicketTypeConfiguration serviceUrl={this.props.serviceUrl} ticketType={this.state.refinedTicketType} getTicketAndSubLevel={this.getTicketingSystemConfig} />
            <ServiceSubLevelConfiguration serviceUrl={this.props.serviceUrl} subLevel={this.state.refinedSubLevel} getTicketAndSubLevel={this.getTicketingSystemConfig} />
            <ProductNameConfiguration serviceUrl={this.props.serviceUrl} productName={this.state.productName} getTicketAndSubLevel={this.getTicketingSystemConfig}/>
          </div>
          </>
        )
      },
      {
        label: (
          <div>
            <p className="title">Jira Field Configuration</p>
            <p className="desc">This allows you to manage jira custom field configuration</p>
          </div>
        ),
        content: (
          <>
            <div className="admin-config-child">
              <JiraConfiguration serviceUrl={this.props.serviceUrl} productName={this.state.productName} jiraCustomField={this.state.refinedJiraCustomField} getTicketAndSubLevel={this.getTicketingSystemConfig} />
            </div>
          </>
        )
      }
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
