import React from 'react';
import i18n from '../../i18n';
import withKeycloak from '../../auth/withKeycloak';
import { Button } from 'carbon-components-react';
import EditProjectModal from '../Admin/EditProjectModal';
import ManagePartnersModal from '../Admin/ManagePartnersModal';
import {isPortalAdmin} from '../../api/helpers';
import { Link } from 'react-router-dom';

class ProjectActionItems extends React.Component {
  constructor() {
    super();
    this.state = {
      showMenu: false,
    };
  }

  handleClick = () => {
    if (!this.state.showMenu) {
      document.addEventListener('mousedown', this.handleOutsideClick, false);
    } else {
      document.removeEventListener('mousedown', this.handleOutsideClick, false);
    }

    this.setState(prevState => ({
      showMenu: !prevState.showMenu,
    }));
  };

  handleOutsideClick = e => {
    if (this.node && !this.node.contains(e.target)) {
      this.handleClick();
    }
  };

  render() {
    const isAdmin = isPortalAdmin();
    const actionDivider = (
      <hr style={{margin: '0', border: 'none', borderTop: '1px solid lightgrey'}}/>
    );
    const topButton = (
      <Button onClick={this.handleClick} style={{padding: '10px 20px'}} kind="tertiary">
        +
      </Button>
    );
    const editProjectSubscription = (
      <div>
        <EditProjectModal
          key={this.props.project.id}
          allProjects={this.props.allProjects}
          project={this.props.project}
          serviceUrl={this.props.serviceUrl}
          updateProjectList={this.props.updateProjectList}
        />
        {actionDivider}
      </div>
    )
    const subscriptionParam = this.props.subscription ? '&subscription=' + this.props.subscription.id : '';
    const newOrRenewSubscription = (
      <div>
        <a
          href={`/entando-de-app/${this.props.locale}/new_or_renew_subscription.page?project=${this.props.project.id}${subscriptionParam}`}
          style={{textDecoration: 'none'}}
        >
          <Button kind="ghost" style={{display: 'block', width: '100%'}} value="Subscription Request">
            {i18n.t('buttons.subscriptionRequest')}
          </Button>
        </a>
        {actionDivider}
      </div>
    );
    const manageUsers = (
      <div>
        <a
          href={`/entando-de-app/${this.props.locale}/manage_users.page?project=${this.props.project.id}`}
          style={{textDecoration: 'none'}}
        >
          <Button kind="ghost" style={{display: 'block', width: '100%'}} value="Manage Users">
            {i18n.t('buttons.manageUsers')}
          </Button>
        </a>
        {actionDivider}
      </div>
    );
    const deleteProject = (
      <div>
        <Button
          kind="ghost"
          onClick={e => this.props.handleDeleteProject(e, this.props.project.id)}
          style={{display: 'block', width: '100%', color: 'red'}}
        >
          {i18n.t('buttons.delete')}
        </Button>
        {actionDivider}
      </div>
    );
    if (!this.props.hasSubscription) {
      return (
        <div>
          {topButton}
          {this.state.showMenu && (
            <div
              className="menu"
              style={{zIndex: '100', position: 'absolute', backgroundColor: 'white'}}
              ref={node => {
                this.node = node;
              }}
            >
              {actionDivider}
              {isAdmin && editProjectSubscription}
              {newOrRenewSubscription}
              {isAdmin && manageUsers}
              {isAdmin && deleteProject}
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div>
          {topButton}
          {this.state.showMenu && (
            <div
              className="menu"
              style={{zIndex: '100', position: 'absolute', backgroundColor: 'white'}}
              ref={node => {
                this.node = node;
              }}
            >
              {actionDivider}
              {/*View Project Subscription*/}
              <Link to={`/subscription-details/${this.props.subscription.id}`} style={{textDecoration: 'none'}}>
                <Button kind="ghost" style={{display: 'block', width: '100%'}} value="View">
                  {i18n.t('buttons.view')}
                </Button>
              </Link>
              {actionDivider}
              {isAdmin && editProjectSubscription}
              {/*Open Ticket*/}
              <a
                href={`/entando-de-app/${this.props.locale}/open_service_ticket.page?project=${this.props.project.id}`}
                style={{textDecoration: 'none'}}
              >
                <Button kind="ghost" style={{display: 'block', width: '100%'}} value="Open Ticket">
                  {i18n.t('buttons.openTicket')}
                </Button>
              </a>
              {actionDivider}
              {/*View All Tickets*/}
              <a
                href={
                  this.props.ticketingSystem.url.substr(0, this.props.ticketingSystem.url.indexOf('/rest')) +
                  '/issues/?jql=Organizations=' + this.props.project.systemId}
                style={{textDecoration: 'none'}}
                target="_blank" rel="noreferrer"
              >
                <Button kind="ghost" style={{display: 'block', width: '100%'}} value="View All Tickets">
                  {i18n.t('buttons.viewAllTickets')}
                </Button>
              </a>
              {actionDivider}
              {!isAdmin && newOrRenewSubscription}
              {isAdmin && (
                <div>
                  {/*Manage Partners*/}
                  <ManagePartnersModal
                    key={this.props.project.id}
                    project={this.props.project}
                    serviceUrl={this.props.serviceUrl}
                    updateProjectList={this.props.updateProjectList}
                  />
                  {actionDivider}
                  {/*Manage Subscriptions*/}
                  <a
                    href={`/entando-de-app/${this.props.locale}/manage_subscriptions.page?project=${this.props.project.id}`}
                    style={{textDecoration: 'none'}}
                  >
                    <Button kind="ghost" style={{display: 'block', width: '100%'}} value="Manage Subscriptions">
                      {i18n.t('buttons.manageSubscriptions')}
                    </Button>
                  </a>
                  {actionDivider}
                  {manageUsers}
                  {/*Delete Project*/}
                  <Button
                    kind="ghost"
                    onClick={e => this.props.handleDeleteProject(e, this.props.project.id)}
                    className="button-warning"
                  >
                    {i18n.t('buttons.delete')}
                  </Button>
                  {actionDivider}
                </div>
              )}
            </div>
          )}
        </div>
      );
    }
  }
}

export default withKeycloak(ProjectActionItems);
