import React, { Component } from "react";
import { isPortalAdminOrSupport } from "../../../api/helpers";
import withKeycloak from "../../../auth/withKeycloak";
import i18n from "../../../i18n";
import { Button, ComposedModal, ModalBody, ModalFooter, ModalHeader, Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow, TextInput, } from 'carbon-components-react';
import { TICKETING_SYSTEM_CONFIG_ENUM, VALIDATION_VARS } from "../../../api/constants";
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
        this.timeoutId = null;
    }

    componentDidMount() {
        this.setState({ changedProductName: this.props.productName })
    }

    onEditProductNameHandle = () => {
        this.setState({ validations: { isError: false, errorMsg: "" }, changedProductName: this.props.productName, open: true })
    }

    onEditProductNameSave = async () => {
        if (!this.state.changedProductName) {
            this.setState({ validations: { isError: true, errorMsg: i18n.t('validation.invalid.required') } })
            return
        }
        if (this.state.changedProductName.length < VALIDATION_VARS.CHAR_MIN_LIMIT) {
            this.setState({ validations: { isError: true, errorMsg: i18n.t('validation.invalid.productNameMinChar') } })
            return
        }
        this.setState({ open: false })
        const updatedProdName = [{ name: this.state.changedProductName }]
        try {
            await apiTicketingSystemConfigResourcePost(this.props.serviceUrl, TICKETING_SYSTEM_CONFIG_ENUM.PRODUCT_NAME, updatedProdName).then(() => {
                this.props.getTicketAndSubLevel()
            });
            this.setState({ changedProductName: this.props.productName })
        } catch (error) {
            console.error('Error onEditProductNameSave: ', error)
        }
    }

    productOnChangeHandler = (e) => {
        if (!e.target && !e.target.value) return
        if (e.target.value.length <= VALIDATION_VARS.CHAR_MAX_LIMIT) {
            if (!e.target.value.length) this.setState({ validations: { isError: true, errorMsg: i18n.t('validation.invalid.required') }, changedProductName: e.target.value })
            else if (e.target.value.length && e.target.value.length < VALIDATION_VARS.CHAR_MIN_LIMIT) {
                this.setState({ validations: { isError: true, errorMsg: i18n.t('validation.invalid.productNameMinChar') }, changedProductName: e.target.value })
            } else {
                this.setState({ validations: { isError: false, errorMsg: "" }, changedProductName: e.target.value })
            }
            return
        }
        if (e.target.value.length >= VALIDATION_VARS.CHAR_MAX_LIMIT) {
            this.setState({ validations: { isError: true, errorMsg: i18n.t('validation.invalid.productNameMaxChar') } })
            if (!this.timeoutId) {
                setTimeout(() => {
                    this.setState({ validations: { isError: false, errorMsg: "" } })
                    this.timeoutId = null;
                }, VALIDATION_VARS.CHAR_LIMIT_MSG_APPEAR_TIME)
            }
            return
        }
    }

    render() {
        if (isPortalAdminOrSupport()) {
            return (
                <>
                    <h4>{i18n.t("adminConfig.productNameConfigurations.title")}</h4>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {headerData.map((head, index) => (
                                        <TableHeader style={{ width: '50%' }} id={index} key={head.key}> {head.header}
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
                        <ModalHeader title={i18n.t('buttons.edit')} />
                        <ModalBody>
                            <TextInput
                                data-modal-primary-focus
                                id="text-input-1"
                                labelText="Product Name*"
                                value={this.state.changedProductName}
                                invalid={this.state.validations.isError} invalidText={this.state.validations.errorMsg}
                                onChange={(e) => { this.productOnChangeHandler(e) }}
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                kind="secondary"
                                onMouseDown={() => { this.setState({ open: false }) }}>
                                {i18n.t('buttons.cancel')}
                            </Button>
                            <Button kind="primary" onClick={() => { this.onEditProductNameSave() }}>
                                {i18n.t('buttons.save')}
                            </Button>
                        </ModalFooter>
                    </ComposedModal>
                </>
            )
        } else {
            return <p>{i18n.t('userMessages.unauthorized')}</p>;
        }
    }
}

const headerData = [
    {
        header: i18n.t('adminConfig.productNameConfigurations.table.prodName'),
        key: 'productName',
    },
    {
        header: i18n.t('customerDashboard.action'),
        key: 'action',
    },
];

export default withKeycloak(ProductNameConfiguration);
