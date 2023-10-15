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
                    toggleShowNotifications={toggleShowNotifications}
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
                className={`toggleSomething ${anyUnread() ?'newNotifications animate__animated':''}`}>
                <i className="fa fa-bell" aria-hidden="true"></i> 
                <span className="hide-text">{anyUnread() ?" New Notifications!":" Notifications"}</span>
            </h2>
        )  
    } else {
        return (
            <div id="myModal" className={`modal ${showNotifications ? "yes-modal" : "" }`} onClick={() => toggleShowNotifications(false)}>
                <div className={`modal-content`} onClick={e => {e.stopPropagation();}}>

                    <h1 
                        style={{textAlign: 'center', fontSize: '1.5rem', padding: '0px', margin: '3px'}}
                        className='toggleSomething'
                        onClick={() => toggleShowNotifications((prevState) => !prevState)}>
                        Hide Notifications
                    </h1>
                    <ul className='notificationsList'>
                        {displayNotifications()}
                    </ul>

                </div>
            </div>
        )
    }
    

    

}

export default Notifications;