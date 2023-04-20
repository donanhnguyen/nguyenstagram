import './App.css';
import {useState, useContext} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import Axios from 'axios';
import GlobalContext from './GlobalContext';

function NavBar () {

    const {
        currentUserState,
        setCurrentUserState
    } = useContext(GlobalContext);
    
    const navigate = useNavigate();

    function logOut () {
        setCurrentUserState(null);
        navigate('/login')
    }

    if (currentUserState) {
         return (
            <div className="nav-bar-container">
                <Link to='/myProfile'><img className="profile-pic" src={`${currentUserState.profilePic}`}></img>
               </Link>
                <h1>Welcome, {currentUserState.username}</h1>

                <Link to='/'>
                    Home
               </Link>


                <button onClick={logOut}>Log Out</button>
            </div>
        )   
    }

}

export default NavBar;