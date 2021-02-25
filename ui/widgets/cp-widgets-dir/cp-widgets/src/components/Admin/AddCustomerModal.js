import React from 'react';
import { ModalWrapper, Form, TextInput } from 'carbon-components-react';
  
const AddCustomerModal = () => (
    <ModalWrapper
        buttonTriggerText="Add a customer + "
        modalHeading="Add a new customer"
        buttonTriggerClassName="add-customer bx--btn bx--btn--tertiary"
        className="modal-form"
    >
    <p> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse cursus fermentum risus, sit amet fringilla nunc pellentesque quis. </p>
       <Form>
            <TextInput name="customerName" labelText="Customer Name" value='' onChange='' />
            <TextInput name="customerNumber" labelText="Customer Number" value='' onChange='' />
            <TextInput name="customerEmail" labelText="Customer Email" value='' onChange='' />
        </Form>
           
    </ModalWrapper>
);

export default AddCustomerModal; 