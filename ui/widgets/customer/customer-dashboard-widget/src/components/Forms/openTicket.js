import React from 'react';
import { render } from 'react-dom';
import 'carbon-components/css/carbon-components.min.css';
import { Form, TextInput, TextArea, Select, SelectItem, Button } from 'carbon-components-react';
import { Grid, Row, Column } from 'carbon-components-react';

const textareaProps = {
  labelText: 'Ticket Description',
  placeholder: 'Add ticket description',
  id: 'ticketDescription'
};

const OpenTicket = () => {
  return (
    <div className="open-ticket">
      <Form>
        <div class="form-desc">
          <h3>Open Service Ticket</h3>
          <p>Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. </p>
        </div>
        <Grid>
          <Row>
            <Column sm={12} md={6} lg={6}>
              <TextInput id="ticketNo" labelText="Ticket Number" />
            </Column>

            <Column sm={12} md={6} lg={6}>
              <TextInput id="customerName" labelText="Customer Name" />
            </Column>
          </Row>
          <Row>
            <Column sm={12} md={6} lg={6}>
              <TextInput id="projectName" labelText="Project Name" />
            </Column>

            <Column sm={12} md={6} lg={6}>
              <TextInput id="openedBy" labelText="Ticket Opened By" />
            </Column>
          </Row>
          <Row>
            <Column sm={12} md={6} lg={6}>
              <TextInput id="priority" labelText="Priority" />
            </Column>

            <Column sm={12} md={6} lg={6}>
              <TextInput id="partnerName" labelText="Partner Name" />
            </Column>
          </Row>
          <TextArea {...textareaProps} />
          <Button kind="primary" tabIndex={0} type="submit">
            {' '}
            Submit{' '}
          </Button>
        </Grid>
      </Form>
    </div>
  );
};

export default OpenTicket;
