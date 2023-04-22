import './App.css';
import {useState, useContext, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import Axios from 'axios';
import GlobalContext from './GlobalContext';

function MyProfile () {

  const {
    currentUserState,
    setCurrentUserState
  } = useContext(GlobalContext);

  return (
    <div className='my-profile-container'>
        <img className="profile-pic" src={`${currentUserState.profilePic}`}></img>
        <h1>{currentUserState.username}</h1>

        <h1>{currentUserState.followers.length} Followers</h1>

        <h1>{currentUserState.following.length} Following</h1>
    </div>
  );
}

export default MyProfile;
