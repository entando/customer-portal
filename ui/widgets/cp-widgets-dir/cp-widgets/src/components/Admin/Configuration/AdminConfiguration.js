import React from 'react';
import i18n from '../../../i18n';
import { Accordion, AccordionItem, Tile } from 'carbon-components-react';
import TicketingSystem from './TicketingSystem';
import ProductVersion from './ProductVersion';

const adminConfig = [
  {
    label: (
      <div>
        <p className="title">{i18n.t('adminConfig.integrationTicketingSystem.title')}</p>
        <p className="desc">{i18n.t('adminConfig.integrationTicketingSystem.desc')}</p>
      </div>
    ),
    content: <TicketingSystem />
  },
  {
    label: (
      <div>
        <p className="title">{i18n.t('adminConfig.manageProductVersion.title')}</p>
        <p className="desc">{i18n.t('adminConfig.manageProductVersion.desc')}</p>
      </div>
    ),
    content: <ProductVersion />
  }
];

const AdminConfiguration = () => (
  <div>
    <h3 className="pageTitle">Entando Admin View</h3>
    <div className="form-container">
      <Tile>
        <p className="title">{i18n.t('adminConfig.title')}</p>
        <p class="desc">{i18n.t('adminConfig.desc')}</p>
      </Tile>
      <Accordion>
        {adminConfig.map((item, index) => (
          <AccordionItem key={index.toString()} index={index} title={item.label} description={item.description}>
            <p>{item.content}</p>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </div>
);

export default AdminConfiguration;
