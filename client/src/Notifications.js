import './App.css';
import SingleNotification from './SingleNotification';
import './Breathing.css';

function Notifications (props) {

    const {
        showNotifications, 
        toggleShowNotifications,
        allNotificationsState,
        notificationsDispatch
    } = props;
    
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
            <h2 onClick={() => toggleShowNotifications((prevState) => !prevState)}
                className={`
                    toggleSomething 
                    ${
                        anyUnread() ?
                        'newNotifications animate__animated'
                        :
                        ''
                    }
                `}
            ><i className="fa fa-bell" aria-hidden="true"></i> 

                {anyUnread() ?
                " New Notifications!"
                :
                " Notifications"
                }
            </h2>
        )  
    } else {
        return (
            <div >
                <h1 
                    className='toggleSomething'
                    onClick={() => toggleShowNotifications((prevState) => !prevState)}>
                    Hide Notifications
                </h1>
                <ul className='notificationsList'>
                    {displayNotifications()}
                </ul>

            </div>
        )
    }
    

    

}

export default Notifications;