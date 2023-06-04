import {useState, useEffect, useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import Axios from 'axios';
import GlobalContext from './GlobalContext';
import PostInsideHomeFeed from './PostInsideHomeFeed';
import Loader from './Loader';

function HomeFeed () {

    const {
        currentUserState,
        renderURL,
        toggleIsLoading,
        isLoading
    } = useContext(GlobalContext);

    const [allPostsState, setAllPostsState] = useState();

    const navigate = useNavigate();

    useEffect(() => {

        Axios.get(`${renderURL}/api/posts/`)
                .then((response) => {
                    setAllPostsState(response.data);
                })
                .catch((error) => {
                    console.log(error);
                })
        if (!currentUserState) {
            navigate("/login");
        } 
    }, []) 

    useEffect(() => {
        toggleIsLoading(true);
        setTimeout(() => {
            toggleIsLoading(false);
        }, 2500);
    }, [])

    function displayHomePagePosts () {
        if (allPostsState) {
            const dispalyedPosts = allPostsState.map((post) => {
                return (<PostInsideHomeFeed key={post._id} post={post}/>)
            })           
            return dispalyedPosts.reverse();
        }
    }

    if (isLoading) {
        return (<Loader/>)
    } else {
        return (
            <div className='App-header'>
                <div className='home'>
                    {displayHomePagePosts()}
                </div>
            </div>
        )    
    }
    
}

export default HomeFeed;