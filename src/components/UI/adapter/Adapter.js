import React from 'react';

import styling from './Adapter.module.scss';

const Adapter = ({ type, size }) => {
    return (
        <div className={styling[size] + ' ' + styling[type]}>
        </div>
    );
};

export default Adapter;