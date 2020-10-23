import React from 'react';
import {Redirect} from 'react-router-dom';
import UserStorage from './storage/UserStorate';

function Logout() {
    UserStorage.logout();
    return <Redirect to='/'/>;
}

export default Logout;
