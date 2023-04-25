import './App.css';
import {useState, useContext, useEffect, useReducer} from 'react';
import {Link, useNavigate, useLocation, useParams} from 'react-router-dom';
import Axios from 'axios';
import GlobalContext from './GlobalContext';

function ProfileShowPage () {

    const [profileUserState, setProfileUserState] = useState();
    const [viewingProfilePostsState, setViewingProfilePostsState] = useState();

    const params = useParams();

    const {
        currentUserState,
        setCurrentUserState,
        currentlyViewingProfile
      } = useContext(GlobalContext);

    useEffect(() => {

        // get posts belonging to the current viewed user
        Axios.get(`http://localhost:8800/api/posts/${params.username}/`)
        .then((response) => {
          setViewingProfilePostsState(response.data);
        })
        .catch((error) => {
          console.log(error.response);
        });

        // get the user's info so we can display their followers info, etc.
        Axios.get(`http://localhost:8800/api/users/${params.username}/`)
        .then((response) => {
          setProfileUserState(response.data);
        })
        .catch((error) => {
          console.log(error.response);
        });

    }, []);

    function displayTheirPosts () {
      if (viewingProfilePostsState) {
        const dispalyedPosts = viewingProfilePostsState.map((post) => {
            return (
              <div key={post._id}>
                <img className='single-post-thumbnail' src={post.picUrl}></img>
              </div>
            )
          })
        return dispalyedPosts;
      }
    };

    if (profileUserState && viewingProfilePostsState) {
      return (
          <div className='my-profile-container'>
          <img className="profile-pic" src={`${profileUserState.profilePic}`}></img>
          <h1>{profileUserState.username}</h1>

          <h1>{viewingProfilePostsState.length} Posts</h1>

          <h1>{profileUserState.followers.length} Followers</h1>

          <h1>{profileUserState.following.length} Following</h1>

          <div className='displayed-posts-container'>
            {displayTheirPosts()}
          </div>

          </div>
      )
    }
    
}

export default ProfileShowPage