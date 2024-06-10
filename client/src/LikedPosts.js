import './App.css';
import {useState, useContext, useEffect, useReducer, } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import GlobalContext from './GlobalContext';
import Notifications from './Notifications';
import Search from './Search';
import Axios from 'axios';

function LikedPosts () {

    const {
        currentUserState,
    } = useContext(GlobalContext);

    if (currentUserState) {
         return (
            
            <div className='my-profile-container'>

                <div className='displayed-posts-container'>
                    <h1>Liked Posts Here</h1>
                </div>

            </div>
        )   
    }

}

export default LikedPosts;