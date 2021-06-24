import React, {Component} from 'react';
import i18n from '../../i18n';
import withKeycloak from '../../auth/withKeycloak';
import {Button, OverflowMenu, OverflowMenuItem} from 'carbon-components-react';
import EditProjectModal from '../Admin/EditProjectModal';
import ManagePartnersModal from '../Admin/ManagePartnersModal';
import {isPortalAdmin} from '../../api/helpers';
import {Link} from 'react-router-dom';
import {withRouter} from 'react-router';

class ProjectActionItems extends Component {
  constructor() {
    super();
    this.state = {
      openEditProject: false,
      openManagePartners: false,
      menu: {},
      //TODO: remove
      showMenu: false,
    };
  }

  handleCloseModal = (e) => {
    if (e) {
      e.preventDefault();
    }
    this.setState({
      openEditProject: false,
      openManagePartners: false
    });
  };

  render() {
    const isAdmin = isPortalAdmin();
    //TODO: remove
    const actionDivider = <hr style={{margin: '0', border: 'none', borderTop: '1px solid lightgrey'}}/>;
    const {history} = this.props;
    //TODO: remove
    const topButton = 'button';

    const deleteProject = isAdmin && (
      <OverflowMenuItem itemText={i18n.t('buttons.delete')}
                        onClick={e => this.props.handleDeleteProject(e, this.props.project.id)}
                        isDelete={true}/>
    );

    const editProject = isAdmin && (
      <OverflowMenuItem itemText={i18n.t('buttons.edit')}
                        onClick={() => this.setState({openEditProject: true})}/>
    );
    const editProjectModal = isAdmin && (
      <EditProjectModal
        open={this.state.openEditProject}
        closeModal={this.handleCloseModal}
        allProjects={this.props.allProjects}
        project={this.props.project}
        serviceUrl={this.props.serviceUrl}
        updateProjectList={this.props.updateProjectList}
      />
    );

    const managePartners = isAdmin && (
      <OverflowMenuItem itemText={i18n.t('buttons.managePartners')}
                        onClick={() => this.setState({openManagePartners: true})}/>
    );
    const managePartnersModal = isAdmin && (
      <ManagePartnersModal
        open={this.state.openManagePartners}
        closeModal={this.handleCloseModal}
        project={this.props.project}
        serviceUrl={this.props.serviceUrl}
        updateProjectList={this.props.updateProjectList}
      />
    );

    const manageSubscriptions = isAdmin && (
      <OverflowMenuItem itemText={i18n.t('buttons.manageSubscriptions')}
                        onClick={() => history.push(`/manage-subscriptions/${this.props.project.id}`)}/>
    );

    const manageUsers = isAdmin && (
      <OverflowMenuItem itemText={i18n.t('buttons.manageUsers')}
                        onClick={() => history.push(`/manage-users/${this.props.project.id}`)}/>
    );

    const subscriptionParam = this.props.subscription ? '/' + this.props.subscription.id : '';
    const newOrRenewSubscription = (
      <OverflowMenuItem itemText={i18n.t('buttons.subscriptionRequest')}
                        onClick={() => history.push(`/subscription/${this.props.project.id}${subscriptionParam}`)}/>
    );

    const openTicket = (
      <OverflowMenuItem itemText={i18n.t('buttons.openTicket')}
                        onClick={() => history.push(`/ticket/${this.props.project.id}`)}/>
    );

    let viewAllTickets = {};
    const ticketingSystem = this.props.ticketingSystem;
    if (ticketingSystem && ticketingSystem.url) {
      const ticketsUrl = ticketingSystem.url.substr(0, ticketingSystem.url.indexOf('/rest')) +
        '/issues/?jql=Organizations=' + this.props.project.systemId;
      viewAllTickets = (
        <OverflowMenuItem itemText={i18n.t('buttons.viewAllTickets')}
                          onClick={() => window.open(ticketsUrl)}/>
      );
    }

    if (!this.props.subscription) {
      return (
        <>
          <OverflowMenu flipped={true} menuOptionsClass='entando-customer-portal'>
            {editProject}
            {newOrRenewSubscription}
            {openTicket}
            {viewAllTickets}
            {manageSubscriptions}
            {manageUsers}
            {managePartners}
            {deleteProject}
          </OverflowMenu>

          {/* Modals */}
          {editProjectModal}
          {managePartnersModal}
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
              {/*{isAdmin && editProject}*/}
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

export default withKeycloak(withRouter(ProjectActionItems));
