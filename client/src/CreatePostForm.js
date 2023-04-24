import './App.css';
import {useState, useContext, useEffect, useReducer} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import Axios from 'axios';
import GlobalContext from './GlobalContext';
import './CreatePostModal.css'

function CreatePostForm (props) {

    const {myPostsDispatch, setShowModal, showModal} = props
    const [picUrlState, setPicUrlState] = useState(null);
    const [captionState, setCaptionState] = useState(null);

    const {
        currentUserState,
        setCurrentUserState
    } = useContext(GlobalContext);

    function handleCreatePost (e) {
        e.preventDefault();
        const postData = {
            picUrl: picUrlState,
            caption: captionState,
            user: currentUserState.username,
            userId: currentUserState._id
        };
        Axios.post(`http://localhost:8800/api/posts/`, postData)
            .then((response) => {
                console.log(response.data);
                myPostsDispatch({type: 'createPost', payload: response.data})
            })
            .catch((error) => console.log(error.response))
        setShowModal(false);
    }

    return (
        <div className=''>
            
            <div id="myModal" className={`modal ${showModal ? "yes-modal" : "" }`}>
            <div className={`modal-content create-post-form-container`}>
                <span onClick={() => setShowModal(false)} className="close">&times;</span>
                
                <form onSubmit={handleCreatePost}>

                    <label>Pic Url</label>
                    <input type='text' onChange={(e) => setPicUrlState(e.target.value)}></input>

                    <br></br>

                    <label>Caption</label>
                    <input type='text' onChange={(e) => setCaptionState(e.target.value)}></input>
                    <br></br>

                    <br></br>
                    <button style={{width: '50%', margin: 'auto'}} className='btn btn-danger btn-lg' onClick={() => setShowModal(false)}>Cancel</button>
                    <button
                        type='submit' 
                        style={{width: '50%', margin: 'auto'}} 
                        className='btn btn-primary btn-lg'
                        >Share
                    </button>
                </form>

            </div>
            </div>

            
                
        </div>
    );
}

export default CreatePostForm;
