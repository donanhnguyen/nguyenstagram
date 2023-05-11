import './App.css';
import {useState, useContext, useEffect, useReducer} from 'react';
import {Link, useNavigate, useLocation, useParams} from 'react-router-dom';
import Axios from 'axios';
import GlobalContext from './GlobalContext';

function ProfileShowPage () {

    const [profileUserState, setProfileUserState] = useState();
    const [viewingProfilePostsState, setViewingProfilePostsState] = useState();
    const [followingOrNot, setFollowingOrNot] = useState();

    const navigate = useNavigate();

    const params = useParams();

    const {
        currentUserState,
      } = useContext(GlobalContext);

    useEffect(() => {
      // check initially if you are following them or not
      if (profileUserState) {
        if (profileUserState.followers.includes(currentUserState.username)) {
          setFollowingOrNot(true);
        } else {
          setFollowingOrNot(false);
        }
      }
      // run this everytime the profileuserstate updates
    }, [profileUserState])

    useEffect(() => {

        // get posts belonging to the current viewed user using the params on react router
        Axios.get(`http://localhost:8800/api/posts/${params.username}/posts/`)
          .then((response) => {
            setViewingProfilePostsState(response.data);
          })
          .catch((error) => {
            console.log(error.response);
          });

    }, []);

    useEffect(() => {
      // get the user's info so we can display their followers info, etc.
        Axios.get(`http://localhost:8800/api/users/${params.username}/`)
          .then((response) => {
            setProfileUserState(response.data);
          })
          .catch((error) => {
            console.log(error.response);
          });
      // run this everytime the followingornot state toggles
    }, [followingOrNot])

    function navigateToPostShowPage (postId) {
      navigate(`/postShowPage/${postId}`);
    };

    function displayTheirPosts () {
      if (viewingProfilePostsState) {
        const dispalyedPosts = viewingProfilePostsState.map((post) => {
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

    function sendNotificationForFollow (username) {
      var notificationBody = {
        message: `${currentUserState.username} has starting following you.`,
        user: username
      }
      Axios.post(`http://localhost:8800/api/notifications/${username}`, notificationBody)
          .then((response) => {
              // console.log(response.data);
          })
          .catch((error) => {
              // console.log(error.response);
          })
    }

    function handleFollowOrUnfollow () {

      // follow them

      if (!followingOrNot) {

          // get the current array of followers and push the loggedinuser into it

          var newFollowersData = profileUserState.followers;
          if (!newFollowersData.includes(currentUserState.username)) {
            newFollowersData.push(currentUserState.username);
          }
          var newDataObject = {followers: newFollowersData};

          // then send it through a PUT request to update THAT user's followers

          Axios.put(`http://localhost:8800/api/users/${params.username}`, newDataObject)
              .then((response) => {
                  setFollowingOrNot(true);
              })
              .catch((error) => {
                  console.log(error.reponse)
              })
          // update CURRENT loggedin user's FOLLOWING array

          var currentLoggedInUsersFollowingArray = currentUserState.following;
          if (!currentLoggedInUsersFollowingArray.includes(params.username)) {
            currentLoggedInUsersFollowingArray.push(params.username);
          }
          var newFollowingArrayData = {following: currentLoggedInUsersFollowingArray};
          Axios.put(`http://localhost:8800/api/users/${currentUserState.username}`, newFollowingArrayData)
              .then((response) => {
              })
              .catch((error) => {
                  console.log(error.reponse)
              })
          
          // send notification to THAT user that you're following them.

          sendNotificationForFollow(profileUserState.username);

      // unfollow them

      } else {

          // filter out the followers excluding myself

          let newData = profileUserState.followers.filter((user) => {
            return user !== currentUserState.username;
          })

          // send the new data

          let newDataObject = {followers: newData};
          Axios.put(`http://localhost:8800/api/users/${params.username}`, newDataObject)
              .then((response) => {
                  setFollowingOrNot(false);
              })
              .catch((error) => {
                  console.log(error.reponse)
              })

          // remove this user from my current following array

          let newFollowingArray = currentUserState.following.filter((user) => {
            return user !== params.username;
          });
          let newFollowingArrayObject = {following: newFollowingArray}

          Axios.put(`http://localhost:8800/api/users/${currentUserState.username}`, newFollowingArrayObject)
              .then((response) => {
              })
              .catch((error) => {
                  console.log(error.reponse)
              })
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

          {/* {followOrUnfollowButton()} */}

          <button onClick={handleFollowOrUnfollow}>
            {followingOrNot ? "Unfollow" : "Follow"}
          </button>

          <div className='displayed-posts-container'>
            {displayTheirPosts()}
          </div>

          </div>
      )
    }
    
}

export default ProfileShowPage