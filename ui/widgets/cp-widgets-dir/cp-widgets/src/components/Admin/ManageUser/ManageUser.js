import React from 'react';
import i18n from '../../../i18n';
import { Accordion, AccordionItem } from 'carbon-components-react';
import AssignUSer from './AssignUser';
import DeleteUser from './DeleteUser';

const user = [
    {
        label: <div><p className="title">{i18n.t('manageUsers.assign.title')}</p><p className="desc">{i18n.t('manageUsers.assign.desc')}</p></div>,
        content: <AssignUSer />
    },
    {
        label: <div><p className="title">{i18n.t('manageUsers.manage.title')}</p><p className="desc">{i18n.t('manageUsers.manage.desc')}</p></div>,
        content: <DeleteUser/>
    }
]

const ManageUser = () => (
    <div>
        <h3 className="pageTitle">Entando Admin View</h3>
        <div className="form-container">
            <Accordion>
                {user.map((item, index) => (
                    <AccordionItem key={index.toString()} index={index} title={item.label} description={ item.description}>
                        <p>{item.content}</p>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    </div>    
)

export default ManageUser;