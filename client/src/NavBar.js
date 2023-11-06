import './App.css';
import {useState, useContext, useEffect, useReducer, } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import GlobalContext from './GlobalContext';
import Notifications from './Notifications';
import Search from './Search';
import Axios from 'axios';

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
        setCurrentUserState,
        renderURL,
    } = useContext(GlobalContext);

    const [showNotifications, toggleShowNotifications] = useState(false);
    const [showSearch, toggleShowSearch] = useState(false);
    const [allNotificationsState, notificationsDispatch] = useReducer(notificationsReducer, []);
    const [logoutModal, setLogoutModal] = useState(false);

    const navigate = useNavigate();

    // get notifications
    useEffect(() => {
        if (currentUserState) {
            Axios.get(`${renderURL}/api/notifications/${currentUserState.username}/`)
                .then((response) => {
                    notificationsDispatch({type: 'getAllNotifications', payload: response.data})
                })    
        }
    }, [currentUserState])

    function logOut () {
        setCurrentUserState(null);
        localStorage.removeItem('user');
        toggleShowNotifications(false);
        toggleShowSearch(false);
        setLogoutModal(false);
        navigate('/login')
    }

    if (currentUserState) {
         return (
            
            <div className="nav-bar-container">

                {/* confirm logout modal */}
                <div id="myModal" className={`modal ${logoutModal ? "yes-modal" : "" }`}>
                    <div className={`modal-content`}>
                        <span onClick={() => setLogoutModal(false)} className="close">&times;</span>
                        <h1 style={{color: 'red', fontSize: '30px', textAlign: 'center'}}>Are you sure you want to log out?</h1>
                        <button style={{width: '50%', margin: 'auto'}} className='btn btn-primary btn-lg' onClick={() => setLogoutModal(false)}>No</button>
                        <button style={{width: '50%', margin: 'auto'}} className='btn btn-danger btn-lg' onClick={logOut}>Yes</button>
                    </div>
                </div>
                
                <h3 className='nguyenstagram'>Nguyenstagram </h3>
                
                <h3>Welcome, {currentUserState.username}</h3>

                <img className="profilePicNavBar" src={`${currentUserState.profilePic}`}></img>

                <div className='nav-links'>
                    <Link to='/'>
                   <h1><i className="fa fa-home" aria-hidden="true"></i> <span className="hide-text">Home</span> </h1>
                    </Link>

                    <Link to='/myProfile'>
                            <h1><i className="fa fa-user" aria-hidden="true"></i> <span className="hide-text">Profile</span></h1>
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
                    
                    <button className='logoutButton btn btn-outline-danger' onClick={() => setLogoutModal(true)}>Log Out</button>
                    <button className='logoutButtonSmall btn btn-outline-danger' onClick={() => setLogoutModal(true)}><i class="fa fa-sign-out" aria-hidden="true"></i></button>
                </div>

            </div>
        )   
    }

}

export default NavBar;