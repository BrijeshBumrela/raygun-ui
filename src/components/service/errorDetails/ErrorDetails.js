import React, { useCallback, useEffect, useState } from 'react';
import { FiChevronLeft, FiTrash2 } from 'react-icons/fi';

import UserInteractions from './userInteractions/UserInteractions';
import { Action } from 'components/UI/button/Button';
import Stacktrace from './stacktrace/Stacktrace';
import Header from './header/Header';
import Graph from './graph/Graph';
import Logs from './logs/Logs';

import fetchClient from 'fetchClient';
import { useStore } from 'context';

import styling from './ErrorDetails.module.scss';

const ErrorDetails = ({ history, match }) => {
    const [_, setError] = useStore();
    
    const [state, setState] = useState({
        id: '',
        adapter: {},
        message: '',
        stacktrace: '',
        evolution: {},
        path: '',
        line: '',
        type: '',
        fingerprint: '',
        badges: {},
        snippet: {},
        logs: [],
        ticket: '',
        host: '',
        userAgent: '',
        metrics: {},
        userInteractions: [],
        clientIp: '',
        count: 0,
        timestamp: 0,
        resolved: (history.location.state || {}).resolved || false,
        seenBy: [],
        lastSeen: ''
    });
    
    const {
        adapter,
        message,
        stacktrace,
        evolution,
        path,
        line,
        type,
        fingerprint,
        snippet,
        logs,
        userInteractions,
        count,
        timestamp,
        resolved,
        seenBy,
        lastSeen
    } = state;
    
    /**
     * Fetches the error with the given ID.
     * @type {(...args: any[]) => any}
     */
    const fetchErrorDetails = useCallback(async () => {
        try {
            if (history.location.state && history.location.state.id) {
                setState(prevState => ({ ...prevState, ...history.location.state }));
            }
            
            const url = '/event/' + match.params.serviceId + '/error/' + match.params.errorId;
            
            const res = await fetchClient('getErrorById', null, url);
            
            setState(prevState => ({ ...prevState, ...res }));
        } catch (error) {
            console.error(error);
            setError(error);
        }
    }, [history.location.state, match.params.errorId, match.params.serviceId, setError]);
    
    
    /**
     * Deletes an error with the given ID.
     * @returns {Promise<void>}
     */
    const deleteError = async () => {
        try {
            const url = '/event/' + match.params.serviceId + '/error/' + match.params.errorId;
            
            await fetchClient('deleteError', null, url);
            
            history.push('/services/' + match.params.serviceId);
            
        } catch (error) {
            console.error(error);
            setError(error);
        }
    };
    
    
    /**
     * Toggles the status of an error with the given ID.
     */
    const resolveHandler = async () => {
        try {
            setState(prevState => ({ ...prevState, resolved: !prevState.resolved }));
            
            const url = '/event/' + match.params.serviceId + '/error/' + match.params.errorId;
            
            await fetchClient('updateError', { resolved: !resolved }, url);
            
        } catch (error) {
            console.error(error);
            setError(error);
        }
    };
    
    
    /**
     * Navigates to the service overview.
     * @returns {void|boolean|*|number}
     */
    const backHandler = () => history.push('/services/' + match.params.serviceId);
    
    
    useEffect(() => {
        fetchErrorDetails();
    }, [fetchErrorDetails]);
    
    const stacktrace1 = "ReferenceError: nonExistentFunction is not defined↵    at HTMLButtonElement.onclick (file:///run/media/coderdude/Adwait/Projects/ASE3/main/Dummy-Services-EAD/demo_browser_app/index.html:33:41)"
    console.log(stacktrace);

    return (
        <>
            <div className={styling.bar}>
                <button className={styling.back} onClick={backHandler}>
                    <FiChevronLeft /> All errors
                </button>
                
                <div className={styling.actions}>
                    <Action icon={<FiTrash2 />} onClick={deleteError}>Delete</Action>
                </div>
            </div>
            
            <Header
                type={type}
                adapter={adapter}
                message={message}
                evolution={evolution}
                fingerprint={fingerprint}
                count={count}
                seenBy={seenBy}
                firstSeen={timestamp}
                lastSeen={lastSeen}
                resolved={resolved}
                resolveHandler={resolveHandler}
            />
            
            <hr />
            
            <Graph data={evolution} firstSeen={timestamp} lastSeen={lastSeen} />
            

            <Stacktrace snippet={snippet} stacktrace={stacktrace} path={path} line={line} />
            
            <UserInteractions userInteractions={userInteractions} errorMessage={message} />
            
            <Logs logs={logs} />
        </>
    );
};

export default ErrorDetails;