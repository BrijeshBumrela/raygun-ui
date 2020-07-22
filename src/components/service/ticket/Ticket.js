import React from 'react';

import Card from 'components/UI/card/Card';

import styling from './Ticket.module.scss';

const Ticket = ({ ticket, serviceName }) => (
    <Card>
        <div className={styling.ticket}>
            <span>{ticket}</span>
        </div>
        
        <p>
            Use this ticket to initialize your Ray Gun adapter.
            All events sent with this ticket will be attached to {serviceName}.
        </p>
    </Card>
);

export default Ticket;