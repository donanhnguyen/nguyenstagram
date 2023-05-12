import './App.css';
import {useState, useContext, useEffect, useReducer} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import Axios from 'axios';
import GlobalContext from './GlobalContext';
import CreatePostForm from './CreatePostForm';

function MyProfile () {

  const navigate = useNavigate();
  const {
    currentUserState,
  } = useContext(GlobalContext);

  function myPostsReducer (state, action) {
    switch (action.type) {
      case 'getUserPosts':
        return action.payload;
      case 'createPost':
        const newArray = [...state, action.payload];
        return newArray;
      case 'deletePost':
        const newState = state.filter((post) => {
          return post._id !== action.payload._id;
        })
        return newState;
      default:
        throw new Error();
    }
  }

  const [myPostsState, myPostsDispatch] = useReducer(myPostsReducer, []);
  const [currentUserInfoState, setCurrentUserInfoState] = useState();
  const [showModal, setShowModal] = useState(false);
  const [showBioInput, toggleBioInput] = useState(false);
  const [bioInputState, setBioInputState] = useState('');

  useEffect(() => {
    // get all posers from logged in user
    Axios.get(`http://localhost:8800/api/posts/${currentUserState.username}/posts/`)
      .then((response) => {
        myPostsDispatch({type: 'getUserPosts', payload: response.data});
      })
      .catch((error) => {
        console.log(error.response);
      })
    // fetch updated info for current user
    Axios.get(`http://localhost:8800/api/users/${currentUserState.username}/`)
      .then((response) => {
        setCurrentUserInfoState(response.data);
      })
      .catch((error) => {
        console.log(error.response);
      });
  }, [])

  function navigateToPostShowPage (postId) {
    navigate(`/postShowPage/${postId}`);
}

  function displayUserPosts () {
    const dispalyedPosts = myPostsState.map((post) => {
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

  function handleEditBio () {
    if (bioInputState !== "") {

      var newDataObject = {bio: bioInputState};

      Axios.put(`http://localhost:8800/api/users/${currentUserState.username}`, newDataObject)
          .then((response) => {
              // set the currentUserInfoState to the new data
              setCurrentUserInfoState(response.data);
              setBioInputState("");
              toggleBioInput(false);
          })
          .catch((error) => {
              console.log(error.reponse)
          })
    }
  }

  function addBioOrNot () {
    if (!currentUserInfoState.bio) {
      return (
        <div>
          <p onClick={() => toggleBioInput((prevState) => !prevState)}><i className="anyIcon fa fa-pencil-square-o" aria-hidden="true"></i> Add Bio</p>
          {showBioInput? <div><input type='text' onChange={(e) => setBioInputState(e.target.value)} value={bioInputState}></input><button onClick={handleEditBio}>Post</button></div> : ""}
        </div>
      )
    } else {
      return (
        <div>
          <p onClick={() => toggleBioInput((prevState) => !prevState)}><i className="anyIcon fa fa-pencil-square-o" aria-hidden="true"></i> Edit Bio</p>
          {showBioInput? <div><input type='text' onChange={(e) => setBioInputState(e.target.value)} value={bioInputState}></input><button onClick={handleEditBio}>Post</button></div> : ""}
        </div>
      )
    }
  }

  if (currentUserInfoState) {
    return (
      <div className='my-profile-container'>

        <img className="profile-pic" src={`${currentUserInfoState.profilePic}`}></img>
        <h1>{currentUserState.username}</h1>

        {/* display bio if it exists or not */}
        <p>{currentUserInfoState.bio? currentUserInfoState.bio : ""}</p>

        {/* add bio or not */}
        { addBioOrNot() }

        <div className='profileInfoPart'>
          
          <h1>{myPostsState.length} Posts</h1>

          <h1>{currentUserInfoState.followers.length} Followers</h1>

          <h1>{currentUserInfoState.following.length} Following</h1>
        </div>
          
          <div className='displayed-posts-container'>
            {displayUserPosts()}
          </div>

          <button className='btn btn-primary btn-lg' onClick={() => setShowModal(true)}>Post A Pic</button>

            <CreatePostForm 
              myPostsDispatch={myPostsDispatch}
              showModal={showModal}
              setShowModal={setShowModal}
            />

      </div>
    );  
  }

}

export default MyProfile;
