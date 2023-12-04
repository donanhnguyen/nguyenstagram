import {useEffect, useState, useContext} from 'react'
import Axios from 'axios';
import GlobalContext from './GlobalContext';

export default function Settings() {

    const {
        currentUserState,
        setCurrentUserState,
        renderURL,
      } = useContext(GlobalContext);

      const [showUploadPic, toggleShowUploadPic] = useState(false);
      const [profilePicUrl, setProfilePicUrl] = useState();
      const [editUsername, toggleEditUsername] = useState(false);
      const [editPassword, toggleEditPassword] = useState(false);
      const [editedUserInfo, setEditedUserInfo] = useState({
        editedUsername: '',
        editedPassword: '',
      })

      const convertProfilePic = (file) => {
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
    
      const handleEditProfilePic = () => {
        if (profilePicUrl) {
          var newData = {profilePic: profilePicUrl};
          Axios.put(`${renderURL}/api/users/${currentUserState.username}/`, newData)
            .then((response) => {
              setCurrentUserState(response.data);
              localStorage.setItem('user', JSON.stringify(response.data));
              setProfilePicUrl(null);
              toggleShowUploadPic(false);
            })
        }
      }

      const handleEditUserInfo = (e) => {
        setEditedUserInfo((prevState) => (
            {...prevState, [`${e.target.name}`]: e.target.value}
        ))
      }

      const handleSubmitEditPassword = () => {
        var newData = {
            password: editedUserInfo.editedPassword
        }
        if (editedUserInfo.editedPassword.length >= 3) {
            Axios.put(`${renderURL}/api/users/${currentUserState.username}/`, newData)
                .then((response) => {
                    setCurrentUserState(response.data);
                    localStorage.setItem('user', JSON.stringify(response.data));
                    toggleEditPassword(false);
                    setEditedUserInfo((prevState) => ({...prevState, password: ''}))
                })
                .catch((error) => console.log(error))
        }
      }

      const handleSubmitEditUsername = () => {
        var newData = {
            username: editedUserInfo.editedUsername
        }
        if (editedUserInfo.editedUsername.length >= 3) {
            Axios.put(`${renderURL}/api/users/${currentUserState.username}/`, newData)
                .then((response) => {
                    setCurrentUserState(response.data);
                    localStorage.setItem('user', JSON.stringify(response.data));
                    toggleEditUsername(false);
                    setEditedUserInfo((prevState) => ({...prevState, username: ''}))
                })
                .catch((error) => console.log(error))
        }
      }

  return (
    <>
        <div className='settings-container'>
            <img className="myProfilePic" src={`${currentUserState.profilePic}`}></img>
            <button onClick={() => toggleShowUploadPic(true)} className='btn btn-secondary btn-lg'>Change Profile Pic</button>
            {/* <h1>{currentUserState.username}</h1> */}

            {/* {editUsername ? <input type='text' name='editedUsername' value={editedUserInfo.editedUsername} onChange={(e) => handleEditUserInfo(e)}></input> : ''}
            <button onClick={() => toggleEditUsername((prevState) => !prevState)} className={`btn ${editUsername ? 'btn-secondary': 'btn-primary'} btn-lg`}>{editUsername ? "Cancel" : "Change Username"}</button>
            {editUsername ? <button className='btn btn-primary btn-lg' onClick={handleSubmitEditUsername}>Edit</button>: ''} */}

            {/* {editPassword ? <input type='text' name='editedPassword' value={editedUserInfo.editedPassword}  onChange={(e) => handleEditUserInfo(e)}></input>: ''}
            <button onClick={() => toggleEditPassword((prevState) => !prevState)} className={`btn ${editPassword ? 'btn-secondary': 'btn-danger'} btn-lg`}>{editPassword ? "Cancel" : "Change Password"}</button>
            {editPassword ? <button className='btn btn-danger btn-lg' onClick={handleSubmitEditPassword}>Edit</button>: ''} */}
        </div>
    
    {/* uploading pic modal */}
        <div id="myModal" className={`modal ${showUploadPic ? "yes-modal" : "" }`} onClick={() => toggleShowUploadPic(false)}>
            <div className={`modal-content create-post-form-container`} onClick={e => {e.stopPropagation();}}>
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
                        style={{width: '25%', margin: 'auto'}} 
                        className='btn btn-danger btn-lg' 
                        onClick={() => toggleShowUploadPic(false)}
                    >
                        Cancel
                    </button>

                    <button
                        style={{width: '25%', margin: 'auto'}} 
                        className='btn btn-primary btn-lg'
                        onClick={handleEditProfilePic}
                    >
                        Confirm
                    </button>

            </div>
        </div>
    </>
    
  )
}
