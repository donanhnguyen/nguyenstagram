import {useState, useEffect, useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import Axios from 'axios';
import GlobalContext from './GlobalContext';

function PostInsideHomeFeed (props) {

    const [liked, setLiked] = useState();
    const navigate = useNavigate();

    const {
        currentUserState,
    } = useContext(GlobalContext);

    const {post} = props;

    let dateArray = post.createdAt.split("");
    let displayedMonth = dateArray.slice(5, 7).join("")
    let displayedDay = dateArray.slice(8, 10).join("")
    let displayedYear = dateArray.slice(0, 4).join("")
    const displayedDate = `${displayedMonth} - ${displayedDay} - ${displayedYear}`;

    useEffect(() => {
        if (post.usersWhoveLiked.includes(currentUserState.username)) {
            setLiked(true);
        } else {
            setLiked(false);
        }
    }, [])
    

    function handleLike () {
        // liking it
        if (!liked) {
            let newData = post.usersWhoveLiked;
            if (!newData.includes(currentUserState.username)) {
               newData.push(currentUserState.username); 
            }
            let newDataObject = {usersWhoveLiked: newData};
            Axios.put(`http://localhost:8800/api/posts/${post._id}`, newDataObject)
                .then((response) => {
                    setLiked(true);
                    console.log(response.data)
                })
                .catch((error) => {
                    console.log(error.reponse)
                })
        // unliking it
        } else {
            let newData = post.usersWhoveLiked.filter((user) => {
                return user !== currentUserState.username;
            })
            let newDataObject = {usersWhoveLiked: newData};
            Axios.put(`http://localhost:8800/api/posts/${post._id}`, newDataObject)
                .then((response) => {
                    setLiked(false);
                    console.log(response.data)
                })
                .catch((error) => {
                    console.log(error.reponse)
                })
        }
        
    }

    function navigateToProfileShowPage (e) {
        if (post.user === currentUserState.username) {
            navigate('/myProfile');
        } else {
            navigate(`/profileShowPage/${e.target.innerText}`, {state: {profileUsername: e.target.innerText}});
        }
    }

    return (
            <div className='home-feed-post-container' key={post._id}>
                <h1 className='link-to-profile-page' onClick={(e) => navigateToProfileShowPage(e)}>{post.user}</h1>
                <h1>{post.caption}</h1>
                <h1>{displayedDate}</h1>
                <img className='single-post-image-in-home-feed' src={post.picUrl}></img>
                <br></br>

                {post.user !== currentUserState.username ? <button onClick={handleLike}>
                    {liked ? "Unlike" : "Like"}
                    </button>: <p>your post</p>}
                {post.user !== currentUserState.username ? <button>Comment</button>: <p>your post</p>}
            </div>
        );
}

export default PostInsideHomeFeed;