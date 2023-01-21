import React, {Component} from 'react';
import i18n from '../../i18n';
import withKeycloak from '../../auth/withKeycloak';
import {OverflowMenu, OverflowMenuItem} from 'carbon-components-react';
import EditProjectModal from '../Admin/EditProjectModal';
import ManagePartnersModal from '../Admin/ManagePartnersModal';
import {isPortalAdmin} from '../../api/helpers';
import {withRouter} from 'react-router';
import {getAllTicketsUrl} from '../../api/ticketingsystem';

class ProjectActionItems extends Component {
  constructor() {
    super();
    this.state = {
      openEditProject: false,
      openManagePartners: false,
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
    const {history} = this.props;

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
    const newOrRenewSubscription = ((!this.props.subscription || !isAdmin) && (
      <OverflowMenuItem itemText={i18n.t('buttons.subscriptionRequest')}
                        onClick={() => history.push(`/subscription/${this.props.project.id}${subscriptionParam}`)}/>
    ));

    const openTicket = this.props.subscription && (
      <OverflowMenuItem itemText={i18n.t('buttons.openTicket')}
                        onClick={() => history.push(`/ticket/${this.props.project.id}`)}/>
    );

    let viewAllTickets = (<></>);
    const ticketingSystem = this.props.ticketingSystem;
    if (this.props.subscription && ticketingSystem && ticketingSystem.url) {
      const ticketsUrl = getAllTicketsUrl(ticketingSystem, this.props.project.systemId);
      viewAllTickets = (
        <OverflowMenuItem itemText={i18n.t('buttons.viewAllTickets')}
                          onClick={() => window.open(ticketsUrl)}/>
      );
    }

    const viewSubscription = this.props.subscription && (
      <OverflowMenuItem itemText={i18n.t('buttons.view')}
                        onClick={() => history.push(`/subscription-details/${this.props.subscription.id}`)}/>
    );

    const overflowModals = (
      <>
        {editProjectModal}
        {managePartnersModal}
      </>
    );

    return (
      <>
        <OverflowMenu flipped={true} menuOptionsClass='entando-customer-portal'>
          {viewSubscription}
          {editProject}
          {newOrRenewSubscription}
          {openTicket}
          {viewAllTickets}
          {manageSubscriptions}
          {manageUsers}
          {managePartners}
          {deleteProject}
        </OverflowMenu>
        {overflowModals}
      </>
    );
  }
}

export default withKeycloak(withRouter(ProjectActionItems));
