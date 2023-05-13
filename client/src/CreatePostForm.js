import './App.css';
import {useState, useContext, useEffect, useReducer} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import Axios from 'axios';
import GlobalContext from './GlobalContext';
import './CreatePostModal.css'

function CreatePostForm (props) {

    const {
            currentUserState,
        } = useContext(GlobalContext);

    const {myPostsDispatch, setShowModal, showModal} = props
    const [captionState, setCaptionState] = useState("");
    const [createPostErrorState, setCreatePostErrorState] = useState();

    // image uploading
    const [image, setImage] = useState();
    const [imageUrl, setImageUrl] = useState();

    useEffect(() => {
        if (image) {
            var picUrl = URL.createObjectURL(image[0]);
            setImageUrl(picUrl);
        }
    }, [image])

    function onImageChange (e) {
        setImage(e.target.files);
    }

    function handleCreatePost () {
        const postData = {
            picUrl: imageUrl,
            caption: captionState,
            user: currentUserState.username,
            userId: currentUserState._id
        };
        Axios.post(`http://localhost:8800/api/posts/`, postData)
            .then((response) => {
                myPostsDispatch({type: 'createPost', payload: response.data});
                setImage(null)
                setImageUrl(null);
                // setPicUrlState("");
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
            
            <div id="myModal" className={`modal ${showModal ? "yes-modal" : "" }`}>
            <div className={`modal-content create-post-form-container`}>
                <span onClick={() => setShowModal(false)} className="close">&times;</span>

                    {/* upload image via link */}
                    <label>Pic Url <i className="fa fa-picture-o" aria-hidden="true"></i></label>
                    <br></br>
                    <input type='text' onChange={(e) => setImageUrl(e.target.value)} value={imageUrl}></input>


                    {/* upload image via file upload */}
                    {/* <div className="file-input">
                        <input className='file' id='file' type='file' accept='image/*' onChange={onImageChange}></input>
                        <label htmlFor="file">Upload Profile Pic</label>
                    </div> */}

                    <br></br>
                    
                    {/* preview image */}
                    {imageUrl?
                    <img className='previewImagePost' style={{height: '150px', width: '200px'}} src={imageUrl}></img>
                    :
                    ""}

                    <br></br>

                    <label>Caption</label>
                    <br></br>
                    <input type='text' onChange={(e) => setCaptionState(e.target.value)} value={captionState}></input>
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
                        onClick={handleCreatePost}
                    >
                        Share
                    </button>
                

            </div>
            </div>

            
                
        </div>
    );
}

export default CreatePostForm;
