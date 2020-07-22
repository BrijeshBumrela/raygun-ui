import React from 'react';
import Badge from 'components/UI/badge/Badge';

import utils from 'utils';

import styling from './Header.module.scss';

const Header = ({ type, message, fingerprint, count, firstSeen, lastSeen }) => {
    return (
        <section className={styling.header}>
        <div className={styling.identity}>
            <Badge size="small" type="neutral">
            {type}
            </Badge>

            <h2>{message}</h2>

            <div className={styling.wrapper}>
            <div className={styling.box}>
                <div className={styling.label}>
                    <span>{fingerprint}</span>
                </div>

                <div className={styling.adapter}>
                    <span>Total occurrences: {count}</span>
                </div>
            </div>

            <div className={styling.centered}>
                <div className={styling.box}>
                    <div className={styling.label}>
                        <span>First seen: {utils.getDateWithTime(firstSeen)}</span>
                    </div>

                    <div className={styling.label}>
                        <span>Last seen: {utils.getDateWithTime(lastSeen)}</span>
                    </div>
                </div>
            </div>
            </div>
        </div>
        </section>
    );
};

export default Header;
