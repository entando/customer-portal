import React, { Component } from "react";
import { authenticationChanged, isAuthenticated, isPortalAdminOrSupport } from "../../../api/helpers";
import withKeycloak from "../../../auth/withKeycloak";
import i18n from "../../../i18n";
import { Button, ComposedModal, ModalBody, ModalFooter, ModalHeader, Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow, TextInput, } from 'carbon-components-react';
import { apiProductVersionsGet } from "../../../api/productVersion";
import { TICKETING_SYSTEM_CONFIG_ENUM } from "../../../api/constants";
import { apiTicketingSystemConfigResourcePost } from "../../../api/manageFieldConfigurations";

class ProductNameConfiguration extends Component {
    constructor() {
        super();
        this.state = {
            open: false,
            validations: [
                { isError: false, errorMsg: '' }
            ],
            changedProductName: ''
        };
    }

    componentDidMount() {
        this.setState({ changedProductName: this.props.productName })
        if (isPortalAdminOrSupport()) {
            this.getProductVersions();
        }
    }

    componentDidUpdate(prevProps) {
        if (authenticationChanged(this.props, prevProps)) {
            if (isPortalAdminOrSupport()) {
                this.getProductVersions();
            }
        }
    }

    async getProductVersions() {
        if (isAuthenticated(this.props)) {
            const productVersions = await apiProductVersionsGet(this.props.serviceUrl);

            this.setState({
                versions: productVersions.data,
            });
        }
    }

    onEditProductNameHandle = () => {
        this.setState({ changedProductName: this.props.productName })
        this.setState({ open: true })
    }

    onEditProductNameSave = async () => {
        alert('How dare you hit me', this.state.changedProductName)
        this.setState({ open: false })
        const updatedProdName = [{ name: this.state.changedProductName }]
        try {
            await apiTicketingSystemConfigResourcePost(this.props.serviceUrl, TICKETING_SYSTEM_CONFIG_ENUM.PRODUCT_NAME, updatedProdName).then(() => {
                this.props.getTicketAndSubLevel()
            });
            this.setState({ changedProductName: this.props.productName })
        } catch (error) {
            console.error('Error ', error)
        }
    }

    productOnChangeHandler = (e) => {
        this.setState({ changedProductName: e.target.value })
    }

    render() {
        if (isPortalAdminOrSupport()) {
            return (
                <>
                    <div>
                        <h4>Product Name Configuration</h4>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        {headerData.map((head, index) => (
                                            <TableHeader id={index} key={head.key}> {head.header}
                                            </TableHeader>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow key={1} id={1}>
                                        <TableCell>{this.props.productName}</TableCell>
                                        <TableCell>
                                            <Button
                                                kind="ghost"
                                                onClick={this.onEditProductNameHandle}
                                                style={{ display: 'flex', width: '100%', color: 'red' }}
                                            >
                                                {i18n.t('buttons.edit')}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <ComposedModal open={this.state.open} onClose={() => { this.setState({ open: false }) }} >
                            <ModalHeader title="Edit" />
                            <ModalBody>
                                <TextInput
                                    data-modal-primary-focus
                                    id="text-input-1"
                                    labelText="Product Name*"
                                    value={this.state.changedProductName}
                                    onChange={(e) => { this.productOnChangeHandler(e) }}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    kind="secondary"
                                    onMouseDown={() => { this.setState({ open: false }) }}>
                                    Cancel
                                </Button>
                                <Button kind="primary" onClick={() => { this.onEditProductNameSave() }}>
                                    Save
                                </Button>
                            </ModalFooter>
                        </ComposedModal>
                    </div>
                </>
            )
        } else {
            return <p>{i18n.t('userMessages.unauthorized')}</p>;
        }
    }
}

const headerData = [
    {
        header: "Product Name",
        key: 'productName',
    },
    {
        header: "Action",
        key: 'action',
    },
];

export default withKeycloak(ProductNameConfiguration);