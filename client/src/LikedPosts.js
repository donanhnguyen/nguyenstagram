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
        setCurrentUserState,
        renderURL
    } = useContext(GlobalContext);

    const [usersLikedposts, setUsersLikedPosts] = useState([])

    const navigate = useNavigate();

    useEffect(() => {
        const localStorageUserInfo = localStorage.getItem("user");

        if (localStorageUserInfo || currentUserState) {
            setCurrentUserState(JSON.parse(localStorage.getItem("user")));
            let usernameToUse;
            if (localStorageUserInfo) {
                usernameToUse = JSON.parse(localStorage.getItem("user")).username
            } else if (currentUserState) {
                usernameToUse = currentUserState.username
            }

            // fetch the updated user's liked posts

            Axios.get(`${renderURL}/api/users/${usernameToUse}/`)
                .then((response) => {
                    setUsersLikedPosts(response.data.likedPosts);
                })
                .catch((error) => {
                    console.log(error.response);
                });
        } else {
            navigate("/login");
        }

    }, [])

    function navigateToPostShowPage (postId) {
        navigate(`/postShowPage/${postId}`);
      };
  
    function displayUsersLikedPosts () {
        if (currentUserState) {
          const dispalyedPosts = usersLikedposts.map((post) => {
              return (
                <div key={post._id} className='single-post-container'>
                  <img 
                    onClick={() => navigateToPostShowPage(post._id)}
                    className='single-post-thumbnail post-pic-link' src={post.picUrl}
                  ></img>
                </div>
              )
            })
          return dispalyedPosts.reverse();
        }
      };
    
    if (currentUserState) {
         return (
            
            <div className='my-profile-container'>
                <h1>Liked Posts</h1>
                <div className='displayed-posts-container'>
                    
                    {displayUsersLikedPosts()}

                </div>

            </div>
        )   
    }

}

export default LikedPosts;