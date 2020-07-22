import React from 'react';

import styling from './Stacktrace.module.scss';

const Stacktrace = ({ snippet, stacktrace, path, line }) => {
    const snippetAvailable = !!Object.keys(snippet || {}).length;
    
    return (
        <section>
            <div className={styling.stacktrace}>
                <h4>Stacktrace</h4>
                
                <div hidden={!snippetAvailable}>
                    <span>full stacktrace</span>
                </div>
            </div>
            
            <div className={styling.wrapper}>
                <p hidden={snippetAvailable ? false : true} className={styling.trace}>{stacktrace}</p>
                
                <div className={styling.info}><b>{path}</b> in line <b>{line}</b></div>
            </div>
        </section>
    );
};

export default Stacktrace;