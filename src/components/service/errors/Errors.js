import React, { useCallback, useEffect, useRef, useState } from 'react';

import Placeholder from 'components/UI/placeholder/Placeholder';
import Button from 'components/UI/button/Button';
import Event from 'components/UI/event/Event';
import Badge from 'components/UI/badge/Badge';

import { useStore } from 'context';
import fetchClient from 'fetchClient';
import config from 'config';
import utils from 'utils';

import styling from './Errors.module.scss';

const Errors = ({ serviceId, history, type = '' }) => {
    const [, , setError] = useStore();
    
    const [state, setState] = useState({
        errors: [],
        selected: {},
        loading: true,
        currentPage: 0,
        fetchedAll: false
    });
    
    const { errors, loading, currentPage, fetchedAll } = state;
    
    
    const intervalId = useRef(0);
    const timeoutId = useRef(0);
    
    
    /**
     * Stops polling.
     */
    const stopPolling = () => {
        clearInterval(intervalId.current);
        clearTimeout(timeoutId.current);
    };
    
    
    /**
     * Fetches the next page of errors.
     * @returns {Promise<void>}
     */
    const fetchErrorsWithPointer = async () => {
        try {
            if (currentPage === 0) {
                stopPolling();
            }
            
            setState(prevState => ({ ...prevState }));
            
            const pointer = '/event/' + serviceId + '/errors/' + (currentPage + 1);
            
            const res = await fetchClient('getAllErrors', null, pointer);
            
            if (res.length < 10) {
                setState(prevState => ({
                    ...prevState,
                    errors: [...prevState.errors, ...res],
                    fetchedAll: true
                }));
                return;
            }
            
            setState(prevState => ({
                ...prevState,
                errors: [...prevState.errors, ...res],
                currentPage: prevState.currentPage + 1
            }));
            
        } catch (error) {
            console.error(error);
            setState(prevState => ({ ...prevState }));
            setError(error);
        }
    };
    
    
    /**
     * Fetches all the latest logs for a given service.
     * @type {(...args: any[]) => any}
     */
    const fetchErrors = useCallback(async (showSpinner) => {
        try {
            setState(prevState => ({
                ...prevState,
                loading: showSpinner,
                currentPage: 0,
                fetchedAll: false
            }));
            
            const fetchingStart = new Date().getTime();
            
            const res = await fetchClient('getAllErrors', null, '/event/' + serviceId + '/errors/');
            
            const fetchingTime = new Date().getTime() - fetchingStart;
            
            if (fetchingTime < 800) {
                await utils.sleep(250);
            }
            
            setState(prevState => ({ ...prevState, errors: res, loading: false }));
            
        } catch (error) {
            console.error(error);
            stopPolling();
            setState(prevState => ({ ...prevState, loading: false }));
            setError(error);
        }
    }, [serviceId, setError, setState]);
    
    
    /**
     * Navigates to the detail page of an error with the given ID.
     * @param error {object} the error that should be opened
     */
    const openErrorDetails = (error) => {
        history.push({
            pathname: '/services/' + serviceId + '/error/' + (error.id || '0'),
            state: error
        });
    };
    
    
    useEffect(() => {
        fetchErrors(true);
        
        intervalId.current = setInterval(fetchErrors, 2500);
        timeoutId.current = setTimeout(stopPolling, 300000);
        
        return stopPolling;
    }, [fetchErrors]);
    
    // Button to load next page
    const loadPage = <Button onClick={fetchErrorsWithPointer} hidden={fetchedAll}>Load more</Button>;
    
    
    // Placeholder if no errors available
    const placeholder = (
        <Placeholder>
            <h4>Connect your service</h4>
            
            <p>Install the adapter to register errors</p>
            
            <Button onClick={() => window.open(config.links.adapters[type], '_blank').focus()}>
                Get the Adapter
            </Button>
        </Placeholder>
    );
    
    
    // List of errors
    const errorList = (
        <>
            <ul className={styling.wrapper}>
                {errors.map(error => (
                    
                    <Event key={error.fingerprint}>
                        <div className={styling.error}>
                            <div className={styling.checkbox}>
                                
                            </div>
                            
                            <div className={styling.cell}>
                                <div className={styling.title} onClick={() => openErrorDetails(error)}>
                                    {error.message}
                                </div>
                                
                                <Badge size='small' type='neutral'>{error.type}</Badge>
                                <Badge size='small' type='info' hidden={!error.resolved}>resolved</Badge>
                            </div>
                            
                 
                            
                            <div>
                                <div className={styling.cell}>
                                    <div>{utils.getDate(error.createdAt)}</div>
                                    <div>first seen</div>
                                </div>
                            </div>
                            
                            <div>
                                <div className={styling.cell}>
                                    <div>{utils.getDate(error.updatedAt)}</div>
                                    <div>last seen</div>
                                </div>
                            </div>
                            
                            <div>
                                <div className={styling.count}>
                                    <div>{utils.shortNumber(error.count)}</div>
                                    <div>count</div>
                                </div>
                            </div>
                        </div>
                    </Event>
                
                ))}
            </ul>
        </>
    );
    
    
    const content = errors.length ? errorList : placeholder;
    
    return (
        <>
            {!loading && content}
            
            <div className={styling.page} hidden={loading || !errors.length || errors.length < 10}>
                {loadPage}
            </div>
        </>
    );
};

export default Errors;