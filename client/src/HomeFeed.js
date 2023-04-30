import {useState, useEffect, useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import Axios from 'axios';
import GlobalContext from './GlobalContext';
import PostInsideHomeFeed from './PostInsideHomeFeed';

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

    function displayHomePagePosts () {
        if (allPostsState) {
            const dispalyedPosts = allPostsState.map((post) => {
                return (<PostInsideHomeFeed key={post._id} post={post}/>)
            })           
            return dispalyedPosts.reverse();
        }
    }

    // console.log("All posts in home")
    // console.log(allPostsState)

    return (
        <div className='App-header'>
            <div className='home'>
                <h1>Home Feed Here:</h1>
                <div>
                    {displayHomePagePosts()}
                </div>
            </div>
        </div>
    )
}

export default HomeFeed;