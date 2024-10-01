import './App.css';
import {useState, useContext, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import Axios from 'axios';
import GlobalContext from './GlobalContext';

function SingleNotification (props) {

    var {notification, notificationsDispatch, toggleShowNotifications} = props;

    const navigate = useNavigate();

    const {
        renderURL
    } = useContext(GlobalContext);

    const [readOrNot, setToRead] = useState(notification.read);

    function markAsRead (notificationId, readStatus) {
        if (!readStatus) {
            var newData = {read: true};
            Axios.put(`${renderURL}/api/notifications/${notificationId}/`, newData)
                .then((response) => {
                    notificationsDispatch({type: 'updateNotification', payload: response.data});
                    setToRead(true);
                })
                .catch((err) => console.log(err))   
        } 
    }
    
    function navigateToPostPage () {
        navigate(`/postShowPage/${notification.postIdLink}`)
        toggleShowNotifications(false);
    }

    function showPostLinkOrNot () {
        if (notification.postIdLink) {
            return (<span onClick={navigateToPostPage} className='any-link'> Link</span>)
        }
    }

    return (
        <li 
            className={`${readOrNot ? "read" : "unread" } single-notification`}
            onClick={() => markAsRead(notification._id, notification.read)}
        >
            <span>{notification.message}</span>{showPostLinkOrNot()}

        </li>
    )    

}

export default SingleNotification;