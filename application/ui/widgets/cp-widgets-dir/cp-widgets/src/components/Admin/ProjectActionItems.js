import React from 'react';
import i18n from '../../i18n';
import withKeycloak from '../../auth/withKeycloak';
import { Button } from 'carbon-components-react';
import EditProjectModal from '../Admin/EditProjectModal';
import ManagePartnersModal from '../Admin/ManagePartnersModal';
import {getPageUrl, isPortalAdmin} from '../../api/helpers';
import {Link} from 'react-router-dom';
import {
  PAGE_MANAGE_USERS,
} from "../../api/constants";

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
    const actionDivider = <hr style={{margin: '0', border: 'none', borderTop: '1px solid lightgrey'}}/>;
    const topButton = (
      <Button onClick={this.handleClick} style={{padding: '10px 20px'}} kind="tertiary">
        +
      </Button>
    );
    const editProject = (
      <>
        <EditProjectModal
          key={this.props.project.id}
          allProjects={this.props.allProjects}
          project={this.props.project}
          serviceUrl={this.props.serviceUrl}
          updateProjectList={this.props.updateProjectList}
        />
        {actionDivider}
      </>
    );
    const subscriptionParam = this.props.subscription ? '/' + this.props.subscription.id : '';
    const newOrRenewSubscription = (
      <>
        <Link to={`/subscription/${this.props.project.id}${subscriptionParam}`}
              style={{textDecoration: 'none'}}>
          <Button kind="ghost" style={{display: 'block', width: '100%'}} value="Subscription Request">
            {i18n.t('buttons.subscriptionRequest')}
          </Button>
        </Link>
        {actionDivider}
      </>
    );
    const managePartners = (
      <>
        <ManagePartnersModal
          key={this.props.project.id}
          project={this.props.project}
          serviceUrl={this.props.serviceUrl}
          updateProjectList={this.props.updateProjectList}
        />
        {actionDivider}
      </>
    );
    const manageUsers = (
      <>
        <a
          href={`${getPageUrl(PAGE_MANAGE_USERS, this.props.locale)}?project=${this.props.project.id}`}
          style={{textDecoration: 'none'}}
        >
          <Button kind="ghost" style={{display: 'block', width: '100%'}} value="Manage Users">
            {i18n.t('buttons.manageUsers')}
          </Button>
        </a>
        {actionDivider}
      </>
    );
    const manageSubscriptions = (
      <>
        <Link to={`/manage-subscriptions/${this.props.project.id}`} style={{textDecoration: 'none'}}>
          <Button kind="ghost" style={{display: 'block', width: '100%'}} value="Manage Subscriptions">
            {i18n.t('buttons.manageSubscriptions')}
          </Button>
        </Link>
        {actionDivider}
      </>
    );
    const openTicket = (
      <>
        <Link to={`/ticket/${this.props.project.id}`} style={{textDecoration: 'none'}}>
          <Button kind="ghost" style={{display: 'block', width: '100%'}} value="Open Ticket">
            {i18n.t('buttons.openTicket')}
          </Button>
        </Link>
        {actionDivider}
      </>
    );
    const ticketingSystem = this.props.ticketingSystem;
    const viewAllTickets = ticketingSystem && ticketingSystem.url && (
      <>
        <a
          href={
            ticketingSystem.url.substr(0, ticketingSystem.url.indexOf('/rest')) +
            '/issues/?jql=Organizations=' +
            this.props.project.systemId
          }
          style={{textDecoration: 'none'}}
          target="_blank"
          rel="noreferrer"
        >
          <Button kind="ghost" style={{display: 'block', width: '100%'}} value="View All Tickets">
            {i18n.t('buttons.viewAllTickets')}
          </Button>
        </a>
        {actionDivider}
      </>
    );
    const deleteProject = (
      <>
        <Button
          kind="ghost"
          onClick={e => this.props.handleDeleteProject(e, this.props.project.id)}
          style={{display: 'block', width: '100%', color: 'red'}}
        >
          {i18n.t('buttons.delete')}
        </Button>
        {actionDivider}
      </>
    );
    if (!this.props.subscription) {
      return (
        <>
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
              {isAdmin && editProject}
              {newOrRenewSubscription}
              {isAdmin && (
                <>
                  {openTicket}
                  {viewAllTickets}
                  {manageSubscriptions}
                  {manageUsers}
                  {managePartners}
                  {deleteProject}
                </>
              )}
            </div>
          )}
        </>
      );
    } else {
      return (
        <>
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
              {isAdmin && editProject}
              {openTicket}
              {viewAllTickets}
              {!isAdmin && newOrRenewSubscription}
              {isAdmin && (
                <>
                  {manageSubscriptions}
                  {manageUsers}
                  {managePartners}
                  {deleteProject}
                </>
              )}
            </div>
          )}
        </>
      );
    }
  }
}

export default withKeycloak(ProjectActionItems);
