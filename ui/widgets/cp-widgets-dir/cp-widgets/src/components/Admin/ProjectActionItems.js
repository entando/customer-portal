import React from 'react';
import i18n from '../../i18n';
import withKeycloak from '../../auth/withKeycloak';
import { Button } from 'carbon-components-react';
import EditProjectModal from '../Admin/EditProjectModal';
import { hasKeycloakClientRole } from '../../api/helpers';
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
    let search = window.location.search;
    let params = new URLSearchParams(search);
    let projectParam = params.get('project');

    if (!this.props.hasSubscription) {
      return (
        <div>
          <Button onClick={this.handleClick} style={{ padding: '10px 20px' }} kind="tertiary">
            +
          </Button>
          {this.state.showMenu ? (
            <div
              className="menu"
              style={{ zIndex: '100', position: 'absolute', backgroundColor: 'white' }}
              ref={node => {
                this.node = node;
              }}
            >
              <hr style={{ margin: '0', border: 'none', borderTop: '1px solid lightgrey' }} />
              {hasKeycloakClientRole('ROLE_ADMIN') ? (
                <div>
                  <EditProjectModal
                    key={this.props.project.id}
                    allProjects={this.props.allProjects}
                    project={this.props.project}
                    serviceUrl={this.props.serviceUrl}
                    updateProjectList={this.props.updateProjectList}
                  />
                  <hr style={{ margin: '0', border: 'none', borderTop: '1px solid lightgrey' }} />
                </div>
              ) : null}
              <a
                href={`/entando-de-app/${this.props.locale}/new_or_renew_subscription.page.page?project=${this.props.project.id}`}
                style={{ textDecoration: 'none' }}
              >
                <Button kind="ghost" style={{ display: 'block', width: '100%' }} value="Subscription Request">
                  Subscription Request
                </Button>
              </a>
              <hr style={{ margin: '0', border: 'none', borderTop: '1px solid lightgrey' }} />
              {hasKeycloakClientRole('ROLE_ADMIN') ? (
                <div>
                  <Button
                    kind="ghost"
                    onClick={e => this.props.handleDeleteProject(e, this.props.project.id)}
                    style={{ display: 'block', width: '100%', color: 'red' }}
                  >
                    Delete
                  </Button>
                  <hr style={{ margin: '0', border: 'none', borderTop: '1px solid lightgrey' }} />
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      );
    } else {
      return (
        <div>
          <Button onClick={this.handleClick} style={{ padding: '10px 20px' }} kind="tertiary">
            +
          </Button>
          {this.state.showMenu ? (
            <div
              className="menu"
              style={{ zIndex: '100', position: 'absolute', backgroundColor: 'white' }}
              ref={node => {
                this.node = node;
              }}
            >
              <Link to={`/subscription-details/${this.props.sub.id}`} style={{ textDecoration: 'none' }}>
                <Button kind="ghost" style={{ display: 'block', width: '100%' }} value="View">
                  View
                </Button>
              </Link>
              <hr style={{ margin: '0', border: 'none', borderTop: '1px solid lightgrey' }} />
              {hasKeycloakClientRole('ROLE_ADMIN') ? (
                <div>
                  <EditProjectModal
                    key={this.props.project.id}
                    allProjects={this.props.allProjects}
                    project={this.props.project}
                    serviceUrl={this.props.serviceUrl}
                    updateProjectList={this.props.updateProjectList}
                  />
                  <hr style={{ margin: '0', border: 'none', borderTop: '1px solid lightgrey' }} />
                </div>
              ) : null}
              <a
                href={`/entando-de-app/${this.props.locale}/open_service_ticket.page?project=${this.props.project.id}`}
                style={{ textDecoration: 'none' }}
              >
                <Button kind="ghost" style={{ display: 'block', width: '100%' }} value="Open Ticket">
                  Open Ticket
                </Button>
              </a>
              <hr style={{ margin: '0', border: 'none', borderTop: '1px solid lightgrey' }} />
              <a
                href={`/entando-de-app/${this.props.locale}/new_or_renew_subscription.page.page?project=${this.props.project.id}`}
                style={{ textDecoration: 'none' }}
              >
                <Button kind="ghost" style={{ display: 'block', width: '100%' }} value="Subscription Request">
                  Subscription Request
                </Button>
              </a>
              <hr style={{ margin: '0', border: 'none', borderTop: '1px solid lightgrey' }} />
              {hasKeycloakClientRole('ROLE_ADMIN') ? (
                <div>
                  <a
                    href={`/entando-de-app/${this.props.locale}/manage_users.page?project=${this.props.project.id}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <Button kind="ghost" style={{ display: 'block', width: '100%' }} value="Manage Users">
                      Manage Users
                    </Button>
                  </a>
                  <hr style={{ margin: '0', border: 'none', borderTop: '1px solid lightgrey' }} />
                  <Button
                    kind="ghost"
                    onClick={e => this.props.handleDeleteProject(e, this.props.project.id)}
                    style={{ display: 'block', width: '100%', color: 'red' }}
                  >
                    Delete
                  </Button>
                  <hr style={{ margin: '0', border: 'none', borderTop: '1px solid lightgrey' }} />
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      );
    }
  }
}

export default withKeycloak(ProjectActionItems);
