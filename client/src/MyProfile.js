import './App.css';
import {useState, useContext, useEffect, useReducer} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import Axios from 'axios';
import GlobalContext from './GlobalContext';
import CreatePostForm from './CreatePostForm';

function MyProfile () {

  const {
    currentUserState,
    setCurrentUserState
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
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    Axios.get(`http://localhost:8800/api/posts/${currentUserState.username}/`)
      .then((response) => {
        myPostsDispatch({type: 'getUserPosts', payload: response.data});
      })
      .catch((error) => {
        console.log(error.response);
      })
  }, [])

  function displayUserPosts () {
    const dispalyedPosts = myPostsState.map((post) => {
      return (
        <div key={post._id}>
          <img className='single-post-thumbnail' src={post.picUrl}></img>
        </div>
      )
    })
    return dispalyedPosts;
  }

  console.log("All posts in my profile")
  console.log(myPostsState);

  return (
    <div className='my-profile-container'>
        <img className="profile-pic" src={`${currentUserState.profilePic}`}></img>
        <h1>{currentUserState.username}</h1>

        <h1>{currentUserState.followers.length} Followers</h1>

        <h1>{currentUserState.following.length} Following</h1>

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

export default MyProfile;
