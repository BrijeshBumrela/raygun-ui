import React, { useState } from 'react';

import { Menu, Tab } from 'components/UI/menu/Menu';
import Settings from './settings/Settings';
import Errors from './errors/Errors';
import Ticket from './ticket/Ticket';

import { useStore } from 'context';

const Service = ({ history, match }) => {
    const [store] = useStore();
    
    const [activeTab, setActiveTab] = useState('errors');
    
    const service = store.services.find(x => x.id === match.params.serviceId) || {};
    
    return (
        <>
            <Menu>
                <Tab active={activeTab === 'errors'} click={() => setActiveTab('errors')}>Errors</Tab>
                <Tab active={activeTab === 'ticket'} click={() => setActiveTab('ticket')}>Ticket</Tab>
                <Tab active={activeTab === 'settings'} click={() => setActiveTab('settings')}>Settings</Tab>
            </Menu>
            
            {activeTab === 'errors' && <Errors serviceId={service.id} type={service.type} history={history} />}
            {activeTab === 'ticket' && <Ticket serviceName={service.name} ticket={service.ticket} />}
            {activeTab === 'settings' && <Settings history={history} serviceName={service.name} serviceId={service.id} />}
        </>
    );
};

export default Service;