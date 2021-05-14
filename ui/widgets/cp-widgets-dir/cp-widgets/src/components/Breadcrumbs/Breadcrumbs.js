import {Component} from 'react';
import withKeycloak from "../../auth/withKeycloak";
import {Breadcrumb, BreadcrumbItem} from "carbon-components-react";
import {getPageUrl} from "../../api/helpers";
import {PAGE_CUSTOMER_PORTAL} from "../../api/constants";

class Breadcrumbs extends Component {

  render() {
    const homeUrl = getPageUrl(PAGE_CUSTOMER_PORTAL, this.props.locale);

    let customer = this.props.customer;
    const project = this.props.project;
    if (project) {
      customer = project.customer;
    }
    const subscription = this.props.subscription;

    return (
      <Breadcrumb>
        <BreadcrumbItem href={homeUrl}>Home</BreadcrumbItem>
        {customer && (
          <BreadcrumbItem href={`${homeUrl}#/customer-details/${customer.id}`}>
            {customer.name}
          </BreadcrumbItem>
        )}
        {subscription && (
          <BreadcrumbItem href={`${homeUrl}#/subscription-details/${subscription.id}`}>
            {project.name}
          </BreadcrumbItem>
        )}
      </Breadcrumb>
    )
  }
}

export default withKeycloak(Breadcrumbs);
