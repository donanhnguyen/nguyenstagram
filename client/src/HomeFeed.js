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

    function displayHomePagePosts () {
        if (allPostsState) {
            const dispalyedPosts = allPostsState.map((post) => {
                return (
                    <div className='home-feed-post-container' key={post._id}>
                        <h1>{post.user}</h1>
                        <h1>{post.caption}</h1>
                        <img className='single-post-image-in-home-feed' src={post.picUrl}></img>
                    </div>
                )
            });
            return dispalyedPosts;
        }
        
      }

    console.log("All posts in home")
    console.log(allPostsState)

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