import {useState, useEffect, useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import Axios from 'axios';
import GlobalContext from './GlobalContext';

function HomeFeed () {

    const {
        currentUserState
    } = useContext(GlobalContext);

    const [allPostsState, setAllPostsState] = useState();

    const navigate = useNavigate();

    useEffect(() => {
        if (!currentUserState) {
            navigate("/login");
        } else {
            Axios.get(`http://localhost:8800/api/posts/`)
                .then((response) => {
                    setAllPostsState(response.data);
                })
                .catch((error) => {
                    console.log(error);
                })
        }
    }, [])

    return (
        <div className='App-header'>
            <div className='home'>
                this is home feed....
            </div>
        </div>
    )
}

export default HomeFeed;