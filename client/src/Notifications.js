import './App.css';
import {useState, useContext, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import Axios from 'axios';
import GlobalContext from './GlobalContext';

function Notifications (props) {

    const {
        currentUserState,
        setCurrentUserState
    } = useContext(GlobalContext);
    
    const {
        showNotifications, 
        toggleShowNotifications,
        allNotificationsState,
    } = props;
    
    const navigate = useNavigate();

    function displayNotifications () {
        const displayed = allNotificationsState.map((notification) => {
            return (
                <li key={notification._id}>{notification.message}</li>
            )
        })
        return displayed.reverse();
    }

    if (!showNotifications) {
        return (
            <h1 onClick={() => toggleShowNotifications((prevState) => !prevState)}>Notifications</h1>
        )  
    } else {
        return (
            <div >
                <h1 onClick={() => toggleShowNotifications((prevState) => !prevState)}>
                    Showing notifications
                </h1>
                <ul>
                    {displayNotifications()}
                </ul>
            </div>
        )
    }
    

    

}

export default Notifications;