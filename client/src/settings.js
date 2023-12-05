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
      const [editPassword, toggleEditPassword] = useState(false);
      const [editedUserInfo, setEditedUserInfo] = useState({
        editedPassword: '',
      })
      const [successModal, toggleSuccessModal] = useState(false);

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
            Axios.put(`${renderURL}/api/users/changePassword/${currentUserState.username}/`, newData)
                .then((response) => {
                    toggleEditPassword(false);
                    setEditedUserInfo((prevState) => ({...prevState, password: ''}))
                    toggleSuccessModal(true);
                    setTimeout(() => {
                        toggleSuccessModal(false);
                    }, 1500)
                })
                .catch((error) => console.log(error))
        }
      }

    if (currentUserState.username === 'test') {
        return <div className='settings-container'>
            <h1>You cannot change settings as a test user.</h1>
        </div>
    } else {
        return (
            <>
                <div className='settings-container'>
                    <img className="myProfilePicInSettings" src={`${currentUserState.profilePic}`}></img>
                    <button onClick={() => toggleShowUploadPic(true)} className='btn btn-secondary btn-lg'>Change Profile Pic</button>
                    <h1>{currentUserState.username}</h1>
        
                    {editPassword ? <input type='text' name='editedPassword' value={editedUserInfo.editedPassword}  onChange={(e) => handleEditUserInfo(e)}></input>: ''}
                    <button onClick={() => toggleEditPassword((prevState) => !prevState)} className={`btn ${editPassword ? 'btn-secondary': 'btn-danger'} btn-lg`}>{editPassword ? "Cancel" : "Change Password"}</button>
                    {editPassword ? <button className='btn btn-danger btn-lg' onClick={handleSubmitEditPassword}>Edit</button>: ''}
                </div>
        
            {/* modal */}
            <div id="myModal" className={`modal ${successModal ? "yes-modal" : "" }`}>
                    <div className={`modal-content`}>
                        <h1 style={{color: 'green', fontSize: '2em'}}>Successfully changed password!</h1>
                    </div>
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
                                style={{width: '45%', margin: 'auto'}} 
                                className='btn btn-danger btn-lg' 
                                onClick={() => toggleShowUploadPic(false)}
                            >
                                Cancel
                            </button>
        
                            <button
                                style={{width: '45%', margin: 'auto'}} 
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

  
}
