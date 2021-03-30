import React, { Component } from 'react';
import i18n from '../../../i18n';
import { Accordion, AccordionItem } from 'carbon-components-react';
import AssignUser from './AssignUser';
import DeleteUser from './DeleteUser';
import { hasKeycloakClientRole } from '../../../api/helpers';
import withKeycloak from '../../../auth/withKeycloak';

class ManageUser extends Component {
  userFunctionality;
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    }
    this.userFunctionality = [
      {
        label: (
          <div>
            <p className="title">{i18n.t('manageUsers.assign.title')}</p>
            <p className="desc">{i18n.t('manageUsers.assign.desc')}</p>
          </div>
        ),
        content: <AssignUser serviceUrl={this.props.serviceUrl} />,
        open: true
      },
      {
        label: (
          <div>
            <p className="title">{i18n.t('manageUsers.manage.title')}</p>
            <p className="desc">{i18n.t('manageUsers.manage.desc')}</p>
          </div>
        ),
        content: <DeleteUser serviceUrl={this.props.serviceUrl} />,
        open: false
      }
    ];
  }

  componentDidMount() {
    const { keycloak } = this.props;
    const authenticated = keycloak.initialized && keycloak.authenticated;
  
    if (authenticated) {
      this.setState({
        loading: false
      })
    }
  }
  
  componentDidUpdate(prevProps) {
    const { keycloak } = this.props;
    const authenticated = keycloak.initialized && keycloak.authenticated;
  
    const changedAuth = prevProps.keycloak.authenticated !== authenticated;
  
    if (authenticated && changedAuth) {
      this.setState({
        loading: false
      });
    }
  }

  render() {
    if (!this.state.loading) {
      if (hasKeycloakClientRole('ROLE_ADMIN')) {
        return (
          <div>
            <h3 className="pageTitle">{i18n.t('adminDashboard.adminTitle')}</h3>
            <div className="form-container">
              <Accordion>
                {this.userFunctionality.map((item, index) => (
                  <AccordionItem key={index.toString()} index={index} title={item.label} description={item.description} open={item.open}>
                    <p>{item.content}</p>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        )
      }
      // Unauthorized
      else {
        return(<p>Unathorized</p>)
      }
    }
    // Loading
    else {
      return(null)
    }
  }
}

export default withKeycloak(ManageUser);
