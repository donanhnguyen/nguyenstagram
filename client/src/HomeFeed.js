import {useEffect, useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import Axios from 'axios';
import GlobalContext from './GlobalContext';

function HomeFeed () {

    const {
        currentUserState
    } = useContext(GlobalContext);

    const navigate = useNavigate();

    useEffect(() => {
        if (!currentUserState) {
            navigate("/login");
        }
    })

    return (
        <div className='App-header'>
            <div className='home'>
                this is home feed....
            </div>
        </div>
    )
}

export default HomeFeed;