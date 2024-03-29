import React, {Component} from 'react';
import i18n from '../../../i18n';
import {Accordion, AccordionItem} from 'carbon-components-react';
import AssignUsers from './AssignUsers';
import DeleteUsers from './DeleteUsers';
import {authenticationChanged, isAuthenticated, isPortalAdmin} from '../../../api/helpers';
import withKeycloak from '../../../auth/withKeycloak';
import Breadcrumbs from "../../Breadcrumbs/Breadcrumbs";

class ManageUsers extends Component {
  userFunctionality;

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
    this.userFunctionality = [
      {
        label: (
          <div>
            <p className="title">{i18n.t('manageUsers.manage.title')}</p>
            <p className="desc">{i18n.t('manageUsers.manage.desc')}</p>
          </div>
        ),
        content: <DeleteUsers {...props} serviceUrl={this.props.serviceUrl}/>,
        open: true,
      },
      {
        label: (
          <div>
            <p className="title">{i18n.t('manageUsers.assign.title')}</p>
            <p className="desc">{i18n.t('manageUsers.assign.desc')}</p>
          </div>
        ),
        content: <AssignUsers {...props} serviceUrl={this.props.serviceUrl}/>,
        open: true,
      },
    ];
  }

  componentDidMount() {
    if (isAuthenticated(this.props)) {
      this.setState({
        loading: false,
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (authenticationChanged(this.props, prevProps)) {
      this.setState({
        loading: false,
      });
    }
  }

  render() {
    if (!this.state.loading) {
      if (isPortalAdmin()) {
        return (
          <div id="entando-customer-portal">
            <Breadcrumbs locale={this.props.locale}/>
            <div className="form-container">
              <Accordion>
                {this.userFunctionality.map((item, index) => (
                  <AccordionItem key={index.toString()} index={index} title={item.label} description={item.description}
                                 open={item.open}>
                    {item.content}
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

export default withKeycloak(ManageUsers);
