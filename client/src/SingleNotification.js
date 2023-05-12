import './App.css';
import {useState, useContext, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import Axios from 'axios';
import GlobalContext from './GlobalContext';

function SingleNotification (props) {

    var {notification, notificationsDispatch} = props;
    const [readOrNot, setToRead] = useState(notification.read);

    function markAsRead (notificationId, readStatus) {
        if (!readStatus) {
            var newData = {read: true};
            Axios.put(`http://localhost:8800/api/notifications/${notificationId}/`, newData)
                .then((response) => {
                    notificationsDispatch({type: 'updateNotification', payload: response.data});
                    setToRead(true);
                })
                .catch((err) => console.log(err))   
        } 
    }

    function showPostLinkOrNot () {
        if (notification.postIdLink) {
            return (<Link to={`/postShowPage/${notification.postIdLink}`}>Link to Post</Link>)
        }
    }

    return (
        <li 
            className={`${readOrNot ? "read" : "unread" } single-notification`}
            onClick={() => markAsRead(notification._id, notification.read)}
        >
            {notification.message} {showPostLinkOrNot()}

        </li>
    )    

}

export default SingleNotification;