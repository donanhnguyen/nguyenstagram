import './App.css';
import {useState, useContext, useEffect, useReducer} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import Axios from 'axios';
import GlobalContext from './GlobalContext';

function CreatePostForm (props) {

    const {myPostsDispatch} = props
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
    }

    return (
        <div className=''>

            <form onSubmit={handleCreatePost}>
                <label>Pic Url</label>
                <input type='text' onChange={(e) => setPicUrlState(e.target.value)}></input>

                <label>Caption</label>
                <input type='text' onChange={(e) => setCaptionState(e.target.value)}></input>

                <button className='btn btn-primary'>Create Post</button>
            </form>
                
        </div>
    );
}

export default CreatePostForm;
