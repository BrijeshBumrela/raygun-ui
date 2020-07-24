import React from 'react';

import styling from './Placeholder.module.scss';

const Placeholder = ({ children }) => (
    <div className={styling.wrapper}>
        <div className={styling.icon}>
        </div>
        
        {children}
    </div>
);

export default Placeholder;