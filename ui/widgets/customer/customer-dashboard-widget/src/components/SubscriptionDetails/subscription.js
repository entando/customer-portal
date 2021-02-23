import React from 'react';
import CustomTable from '../customDataTable';
import { Tile } from 'carbon-components-react';
import { Grid, Row, Column } from 'carbon-components-react';

const subscriptionData = {
  description: 'Entando Product Support Subscription Suplier Portal',
  commitment: 'Leonardo',
  type: 'Product Support Subscription Entando Platform',
  quantityRequest: '1(8 Crore)',
  components: '',
  level: 'Gold',
  startDate: 'May 2019',
  endDate: 'May 2020',
  license: 'Free Commercial Open Source'
};
const Subscription = () => {
  const { description, commitment, type, quantityRequest, components, level, startDate, endDate, license } = subscriptionData;
  return (
    <div className="subscription-details">
      <Tile>
        <Grid>
          <Row>
            <Column md={4}>
              <p>
                <strong>Description:</strong> {description}
              </p>
              <p>
                <strong>Commitment:</strong> {commitment}
              </p>
              <p>
                <strong>Type:</strong> {type}
              </p>
              <p>
                <strong>Quantity Request:</strong> {quantityRequest}
              </p>
              <p>
                <strong>Components:</strong> {components}
              </p>
            </Column>

            <Column md={4}>
              <p>
                <strong>Level:</strong> {level}
              </p>
              <p>
                <strong>Start Date:</strong> {startDate}
              </p>
              <p>
                <strong>End Date:</strong> {endDate}
              </p>
              <p>
                <strong>License:</strong> {license}
              </p>
            </Column>
          </Row>
        </Grid>
      </Tile>
      <br />
      <CustomTable />
    </div>
  );
};

export default Subscription;
