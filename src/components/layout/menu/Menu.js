import React from 'react';
import { Link } from 'react-router-dom';

import styling from './Menu.module.scss';

const Menu = ({ reference = null, children }) => (
    <nav className={styling.nav} ref={reference}>
        <div className={styling.content}>
            <Link to='/auth'></Link>
            {children}
        </div>
    </nav>
);

export default Menu;