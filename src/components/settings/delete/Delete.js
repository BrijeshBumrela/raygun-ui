import React, { useState } from 'react';

import Confirmation from 'components/UI/confirmation/Confirmation';
import Button from 'components/UI/button/Button';
import Card from 'components/UI/card/Card';

import { useStore } from 'context';
import fetchClient from 'fetchClient';

import styling from './Delete.module.scss';

const Delete = ({ isOrganizationOwner, history }) => {
    const [, , setError] = useStore();
    const [confirmVisibility, setConfirmVisibility] = useState(false);
    
    /**
     * Toggles the modal visibility.
     */
    const toggleConfirmVisibility = () => {
        setConfirmVisibility(prevState => !prevState);
    };
    
    /**
     * Deletes the current user.
     * @returns {Promise<void>}
     */
    const deleteUser = async () => {
        try {
            await fetchClient('deleteUserAccount');
            
            localStorage.clear();
            
            history.push('/auth/signin');
            
        } catch (error) {
            console.error(error);
            setError(error);
        }
    };
    
    const caption = isOrganizationOwner ? 'You can not delete your account as organization owner' : 'Delete your user account';
    
    return (
        <>
            <Card>
                <div className={styling.row}>
                    <div className={styling.description}>
                        <h6>Delete</h6>
                        <p>{caption}</p>
                    </div>
                    
                    <Button size='smaller' onClick={toggleConfirmVisibility} disabled={isOrganizationOwner}>Delete</Button>
                </div>
            </Card>
            
            <Confirmation
                open={confirmVisibility}
                title='Delete your account'
                message='Please confirm that you want to delete your user account and all your data. Deleting your account is permanent and can not be undone.'
                confirmHandler={deleteUser}
                cancelHandler={toggleConfirmVisibility}
            />
        </>
    );
};

export default Delete;