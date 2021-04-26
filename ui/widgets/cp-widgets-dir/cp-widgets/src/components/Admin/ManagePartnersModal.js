import React, {Component} from 'react';
import i18n from '../../i18n';
import {
  Button,
  DataTable,
  ModalWrapper,
  Table, TableBody,
  TableCell, TableContainer, TableHead, TableHeader,
  TableRow,
} from 'carbon-components-react';
import withKeycloak from '../../auth/withKeycloak';
import {isPortalAdminOrSupport} from "../../api/helpers";
import {apiDeletePartnerFromProject} from "../../api/projects";

class ManagePartnersModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      projectId: this.props.project.id,
      project: this.props.project,
    }

    this.headerData = [
      {
        header: i18n.t('adminDashboard.addPartner.partnerName'),
        key: 'partner',
      },
      {
        header: i18n.t('adminDashboard.addPartner.partnerNumber'),
        key: 'partnerNumber',
      },
      {
        header: i18n.t('customerDashboard.action'),
        key: 'action',
      },
    ];
  }

  async removePartner(projectId, partnerId) {
    if (isPortalAdminOrSupport()) {
      return await apiDeletePartnerFromProject(this.props.serviceUrl, projectId, partnerId);
    }
  }

  handleRemovePartner = (e, projectId, partnerId) => {
    e.preventDefault();
    if (window.confirm('Are you sure you want to remove this partner from the project?')) {
      this.removePartner(projectId, partnerId)
        .then((result) => {
          this.setState({
            project: result.data,
            submitMsg: i18n.t('submitMessages.deleted'),
            submitColour: '#24a148',
          });
          this.props.updateProjectList();
        })
        .catch((err) => {
          console.log(err);
          this.setState({
            submitMsg: i18n.t('submitMessages.error'),
            submitColour: '#da1e28',
          });
        });
    }
  };

  render() {
    const modalConfirmation = (
      <div className="bx--modal-header">
        <p style={{color: this.state.submitColour}}>{this.state.submitMsg}</p>
      </div>
    )
    const modalId = "modal-form-manage-partners";
    return (
      <ModalWrapper
        buttonTriggerText={i18n.t('buttons.managePartners')}
        modalHeading={i18n.t('adminDashboard.managePartners.title')}
        buttonTriggerClassName="add-partner bx--btn bx--btn--tertiary add-partner-button"
        className="modal-form"
        id={modalId}
        hasForm={false}
        primaryButtonText={i18n.t('modalText.done')}
        secondaryButtonText={null}
      >
        {modalConfirmation}
        <div>
          <DataTable rows={rowData} headers={this.headerData}>
            {({rows, headers, getHeaderProps, getTableProps}) => (
              <TableContainer description={i18n.t('customerDashboard.tableDesc')}>
                <Table {...getTableProps()}>
                  <TableHead>
                    <TableRow key="headerRow">
                      {headers.map(header => {
                        return <TableHeader {...getHeaderProps({header})}>
                          {header.header}
                        </TableHeader>
                      })}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.project.partners.map((partner, index) => {
                      return (
                        <TableRow key={"partner" + index}>
                          <TableCell>
                            {partner.name}
                          </TableCell>
                          <TableCell>
                            {partner.partnerNumber}
                          </TableCell>
                          <TableCell>
                            <div>
                              <Button
                                kind="ghost"
                                onClick={e => this.handleRemovePartner(e, this.state.projectId, partner.id)}
                                style={{display: 'block', width: '100%', color: 'red'}}
                              >
                                {i18n.t('buttons.delete')}
                              </Button>
                              <hr style={{margin: '0', border: 'none', borderTop: '1px solid lightgrey'}}/>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })
                    }
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </DataTable>
        </div>
        {modalConfirmation}
      </ModalWrapper>
    );
  }
}

const rowData = [
  {
    id: 'a',
    name: 'Partner 1',
    partnerNumber: '123',
  },
  {
    id: 'b',
    name: 'Partner 2',
    partnerNumber: '456',
  },
];

export default withKeycloak(ManagePartnersModal);
