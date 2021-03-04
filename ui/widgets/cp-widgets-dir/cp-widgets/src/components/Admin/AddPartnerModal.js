import React from 'react';
import { ModalWrapper, Form, TextInput } from 'carbon-components-react';
  
const AddPartnerModal = () => (
    <ModalWrapper
        buttonTriggerText="Add a partner + "
        modalHeading="Add a new partner"
        buttonTriggerClassName="add-partner bx--btn bx--btn--tertiary"
        className="modal-form"
    >
    <p> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse cursus fermentum risus, sit amet fringilla nunc pellentesque quis. </p>
       <Form>
            <TextInput name="partnerName" labelText="Partner Name" value='' onChange='' />
            <TextInput name="partnerNumber" labelText="Partner Number" value='' onChange='' />
            <TextInput name="partnerEmail" labelText="Partner Email" value='' onChange='' />
        </Form>
    </ModalWrapper>
);

export default AddPartnerModal; 