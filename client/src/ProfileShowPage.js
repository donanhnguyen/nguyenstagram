import './App.css';
import {useState, useContext, useEffect, useReducer} from 'react';
import {Link, useNavigate, useLocation, useParams} from 'react-router-dom';
import Axios from 'axios';
import GlobalContext from './GlobalContext';

function ProfileShowPage () {

    const [profileUserState, setProfileUserState] = useState();
    const [viewingProfilePostsState, setViewingProfilePostsState] = useState();
    const [followingOrNot, setFollowingOrNot] = useState(false);

    const params = useParams();

    const {
        currentUserState,
      } = useContext(GlobalContext);

    useEffect(() => {

        // get posts belonging to the current viewed user using the params on react router
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

    useEffect(() => {
      if (profileUserState) {
        if (!profileUserState.followers.includes(currentUserState.username)) {
          setFollowingOrNot(false);
        } else {
          setFollowingOrNot(true);
        }
      }
    }, [])

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

    function handleFollow () {
        // get the current array of followers and push the loggedinuser into it
        var newFollowersData = profileUserState.followers;
        newFollowersData.push(currentUserState.username);
        var newDataObject = {followers: newFollowersData};
        // then send it through a PUT request to update THAT user's followers
        Axios.put(`http://localhost:8800/api/users/${params.username}`, newDataObject)
            .then((response) => {
                setFollowingOrNot(true);
                console.log(response.data)
            })
            .catch((error) => {
                console.log(error.reponse)
            })
        // update CURRENT loggedin user's FOLLOWING array
    }

    function handleUnfollow () {
      
      let newData = profileUserState.followers.filter((user) => {
        return user !== currentUserState.username;
      })
      let newDataObject = {followers: newData};
      Axios.put(`http://localhost:8800/api/users/${params.username}`, newDataObject)
          .then((response) => {
              setFollowingOrNot(false);
              console.log(response.data)
          })
          .catch((error) => {
              console.log(error.reponse)
          })
    }

    function followOrUnfollowButton () {
      if (!profileUserState.followers.includes(currentUserState.username)) {
        return (
          <button onClick={handleFollow}>Follow</button>
        )
      } else {
        return (
          <button onClick={handleUnfollow}>Unfollow</button>
        )
      }
    }

    if (profileUserState && viewingProfilePostsState) {
      return (
          <div className='my-profile-container'>
          <img className="profile-pic" src={`${profileUserState.profilePic}`}></img>
          <h1>{profileUserState.username}</h1>

          <h1>{viewingProfilePostsState.length} Posts</h1>

          <h1>{profileUserState.followers.length} Followers</h1>

          <h1>{profileUserState.following.length} Following</h1>

          {followOrUnfollowButton()}

          <div className='displayed-posts-container'>
            {displayTheirPosts()}
          </div>

          </div>
      )
    }
    
}

export default ProfileShowPage