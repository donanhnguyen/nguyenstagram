import './App.css';
import {useState, useContext, useEffect, useReducer} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import Axios from 'axios';
import GlobalContext from './GlobalContext';
import Notifications from './Notifications';
import Search from './Search';

function notificationsReducer (state, action) {
    switch (action.type) {
      case 'getAllNotifications':
        return action.payload;
      case 'updateNotification':
        const newArray = state;
        for (let i in newArray) {
            if (newArray[i]._id === action.payload._id) {
                newArray[i] = action.payload;
            }
        }
        return newArray;
      default:
        throw new Error();
    }
}

function NavBar () {

    const {
        currentUserState,
        setCurrentUserState
    } = useContext(GlobalContext);

    const [showNotifications, toggleShowNotifications] = useState(false);
    const [showSearch, toggleShowSearch] = useState(false);
    const [allNotificationsState, notificationsDispatch] = useReducer(notificationsReducer, []);

    const navigate = useNavigate();

    // get notifications
    useEffect(() => {
        if (currentUserState) {
            Axios.get(`http://localhost:8800/api/notifications/${currentUserState.username}/`)
                .then((response) => {
                    notificationsDispatch({type: 'getAllNotifications', payload: response.data})
                })    
        }
    }, [currentUserState])

    function logOut () {
        setCurrentUserState(null);
        toggleShowNotifications(false);
        toggleShowSearch(false);
        navigate('/login')
    }

    if (currentUserState) {
         return (
            <div className="nav-bar-container">
                
                <h2 style={{fontSize: '30px'}} className='nguyenstagram'>Nguyenstagram</h2>

                <h2>Welcome, {currentUserState.username}</h2>

                <Link to='/'>
                   <h1>Home</h1>
               </Link>

               <Link to='/myProfile'>
                    <h1>Profile</h1>
               </Link>

               <Search 
                    showSearch={showSearch}
                    toggleShowSearch={toggleShowSearch}
               />

               <Notifications 
                    showNotifications={showNotifications}
                    toggleShowNotifications={toggleShowNotifications}
                    allNotificationsState={allNotificationsState}
                    notificationsDispatch={notificationsDispatch}
               />

                <button className='logoutButton' onClick={logOut}>Log Out</button>
            </div>
        )   
    }

}

export default NavBar;