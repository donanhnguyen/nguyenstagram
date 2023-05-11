import './App.css';
import {useState, useContext, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import Axios from 'axios';
import GlobalContext from './GlobalContext';
import SingleNotification from './SingleNotification';

function Notifications (props) {

    const {
        currentUserState,
        setCurrentUserState
    } = useContext(GlobalContext);
    
    const {
        showNotifications, 
        toggleShowNotifications,
        allNotificationsState,
        notificationsDispatch
    } = props;
    
    const navigate = useNavigate();

    function displayNotifications () {
        const displayed = allNotificationsState.map((notification) => {
            return (
                <SingleNotification 
                    key={notification._id}
                    notification={notification}
                    notificationsDispatch={notificationsDispatch}
                />
            )
        })
        return displayed.reverse();
    }

    function anyUnread () {
        for (let i in allNotificationsState) {
            if (allNotificationsState[i].read === false) {
                return true;
            }
        }
        return false;
    }

    if (!showNotifications) {
        return (
            <h1 onClick={() => toggleShowNotifications((prevState) => !prevState)}
                className='toggleSomething'
            >
                {anyUnread() ?
                "New Notifications!"
                :
                "Notifications"
                }
            </h1>
        )  
    } else {
        return (
            <div >
                <h1 
                    className='toggleSomething'
                    onClick={() => toggleShowNotifications((prevState) => !prevState)}>
                    Showing notifications
                </h1>
                <ul className='notificationsList'>
                    {displayNotifications()}
                </ul>

            </div>
        )
    }
    

    

}

export default Notifications;