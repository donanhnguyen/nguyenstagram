import './App.css';
import {useState, useContext} from 'react';
import Axios from 'axios';
import GlobalContext from './GlobalContext';
import './CreatePostModal.css'

function CreatePostFormFromHomePage (props) {

    const {
            currentUserState,
            renderURL
        } = useContext(GlobalContext);

    const {setShowModal, showModal, refreshAllPosts} = props
    const [captionState, setCaptionState] = useState("");
    const [createPostErrorState, setCreatePostErrorState] = useState();

    // image uploading
    const [imageUrl, setImageUrl] = useState();

    function convertToBase64 (file) {
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

    const handleFileUpload = async (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        const base64 = await convertToBase64(file);
        setImageUrl(base64);
    }
    // end of image uploading

    function handleCreatePost (e) {
        e.preventDefault();
        const postData = {
            picUrl: imageUrl,
            caption: captionState,
            user: currentUserState.username,
            userId: currentUserState._id
        };
        Axios.post(`${renderURL}/api/posts/`, postData)
            .then((response) => {
                refreshAllPosts();
                setImageUrl(null);
                setCaptionState("");
                setShowModal(false);
            })
            .catch((error) => {
                setCreatePostErrorState("Field's can't be blank.");
                setTimeout(() => {
                    setCreatePostErrorState('');
                }, 2000)
            })
        
    }

    return (
        <div>
            
            <div id="myModal" className={`modal ${showModal ? "yes-modal" : "" }`} onClick={() => setShowModal(false)}>
                <div className={`create-post-modal-content create-post-form-container`} onClick={e => {e.stopPropagation();}}>
                    <span onClick={() => setShowModal(false)} className="close">&times;</span>

                        {/* upload image via file upload */}
                        <div className="file-input">
                            <input className='file' id='file' type='file' accept='image/*' onChange={(e) => handleFileUpload(e)}></input>
                            <label htmlFor="file">Upload Pic</label>
                        </div>

                    
                        
                        {/* preview image */}
                        {imageUrl?
                        <img className='previewImagePost' style={{height: '150px', width: '200px'}} src={imageUrl}></img>
                        :
                        ""}

                            <br></br>

                        <label>Caption</label>
                        <br></br>
                        <input type='text' style={{width: '100%', textAlign: 'center', margin: 'auto'}} onChange={(e) => setCaptionState(e.target.value)} value={captionState}></input>
                        <br></br>

                        <p style={{color: 'red'}}>{createPostErrorState}</p>

                        <br></br>
                        <button 
                            style={{width: '50%', margin: 'auto'}} 
                            className='btn btn-danger btn-lg' 
                            onClick={() => setShowModal(false)}
                        >
                            Cancel
                        </button>

                        <button
                            style={{width: '50%', margin: 'auto'}} 
                            className='btn btn-primary btn-lg'
                            onClick={(e) => handleCreatePost(e)}
                        >
                            Share
                        </button>
                </div>
            </div>
 
        </div>
    );
}

export default CreatePostFormFromHomePage;