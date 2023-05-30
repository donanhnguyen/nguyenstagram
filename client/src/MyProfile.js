import './App.css';
import {useState, useContext, useEffect, useReducer} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import Axios from 'axios';
import GlobalContext from './GlobalContext';
import CreatePostForm from './CreatePostForm';
import Loader from './Loader';
import Image from 'react-bootstrap/Image'

function MyProfile () {

  const navigate = useNavigate();
  const {
    currentUserState,
    setCurrentUserState,
    renderURL,
    isLoading,
    toggleIsLoading
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

  // uploading pic
  const [showUploadPic, toggleShowUploadPic] = useState(false);
  const [profilePicUrl, setProfilePicUrl] = useState();

  function convertProfilePic (file) {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
            resolve(fileReader.result);
        };
        fileReader.onerror = (error) => {
            reject(error);
        }
    })
  }

  const handleUploadProfilePic = async (e) => {
      e.preventDefault();
      const file = e.target.files[0];
      const base64 = await convertProfilePic(file);
      setProfilePicUrl(base64);
  }

  function handleEditProfilePic () {
    if (profilePicUrl) {
      var newData = {profilePic: profilePicUrl};
      Axios.put(`${renderURL}/api/users/${currentUserState.username}/`, newData)
        .then((response) => {
          setCurrentUserInfoState(response.data);
          setCurrentUserState(response.data);
          setProfilePicUrl(null);
          toggleShowUploadPic(false);
        })
    }
  }

  // end of uploading pic

  useEffect(() => {
    toggleIsLoading(true);
    setTimeout(() => {
        toggleIsLoading(false);
    }, 500);
  }, [])

  useEffect(() => {
    // get all posers from logged in user
    Axios.get(`${renderURL}/api/posts/${currentUserState.username}/posts/`)
      .then((response) => {
        myPostsDispatch({type: 'getUserPosts', payload: response.data});
      })
      .catch((error) => {
        console.log(error.response);
      })
    // fetch updated info for current user
    Axios.get(`${renderURL}/api/users/${currentUserState.username}/`)
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
          <Image thumbnail={true} src={post.picUrl}  className='single-post-thumbnail post-pic-link' onClick={() => navigateToPostShowPage(post._id)}></Image>
          {/* <img 
            onClick={() => navigateToPostShowPage(post._id)}
            className='single-post-thumbnail post-pic-link' src={post.picUrl}
          ></img> */}
        </div>
      )
    })
    return dispalyedPosts.reverse();
  }

  function handleEditBio () {
    if (bioInputState !== "") {

      var newDataObject = {bio: bioInputState};

      Axios.put(`${renderURL}/api/users/${currentUserState.username}`, newDataObject)
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
          {showBioInput? <div><input type='text' style={{marginBottom: '10px'}} onChange={(e) => setBioInputState(e.target.value)} value={bioInputState}></input><button onClick={handleEditBio}>Post</button></div> : ""}
        </div>
      )
    } else {
      return (
        <div>
          <p onClick={() => toggleBioInput((prevState) => !prevState)}><i className="anyIcon fa fa-pencil-square-o" aria-hidden="true"></i> Edit Bio</p>
          {showBioInput? <div><input type='text' style={{marginBottom: '10px'}} onChange={(e) => setBioInputState(e.target.value)} value={bioInputState}></input><button onClick={handleEditBio}>Post</button></div> : ""}
        </div>
      )
    }
  }

  if (currentUserInfoState) {
    return (
      <div className='my-profile-container'>

        <img onClick={() => toggleShowUploadPic((prevState) => !prevState)} className="myProfilePic" src={`${currentUserInfoState.profilePic}`}></img>
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

      {/* uploading pic modal */}
      <div id="myModal" className={`modal ${showUploadPic ? "yes-modal" : "" }`}>
            <div className={`modal-content create-post-form-container`}>
                <span onClick={() => toggleShowUploadPic(false)} className="close">&times;</span>


                    {/* upload image via file upload */}
                    <div className="file-input">
                        <h2>Edit Profile Pic</h2>
                        <input className='file' id='profilePic' type='file' accept='image/*' onChange={(e) => handleUploadProfilePic(e)}></input>
                        <label style={{width: '50%'}} htmlFor="profilePic">Upload</label>
                    </div>

                    <br></br>
                    
                    {/* preview image */}
                    {profilePicUrl?
                    <img className='previewImagePost' style={{height: '150px', width: '150px', borderRadius: '50%'}} src={profilePicUrl}></img>
                    :
                    ""}

                      <br></br>

                    <button 
                        style={{width: '50%', margin: 'auto'}} 
                        className='btn btn-danger btn-lg' 
                        onClick={() => toggleShowUploadPic(false)}
                    >
                        Cancel
                    </button>

                    <button
                        style={{width: '50%', margin: 'auto'}} 
                        className='btn btn-primary btn-lg'
                        onClick={handleEditProfilePic}
                    >
                        Confirm
                    </button>

            </div>
        </div>


      </div>
    );  
  } else if (isLoading) {
    return (<Loader/>)
  }

}

export default MyProfile;
