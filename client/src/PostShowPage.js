import {useState, useEffect, useContext} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './App.css';
import './Modals.css';
import Axios from 'axios';
import GlobalContext from './GlobalContext';

function PostShowPage () {

    const params = useParams();
    const [postInfoState, setPostInfoState] = useState();
    const [toggledConfirm, setToggledConfirm] = useState(false);
    const [liked, setLiked] = useState();
    const navigate = useNavigate();

    const {
        currentUserState,
    } = useContext(GlobalContext);

    if (postInfoState) {
        let dateArray = postInfoState.createdAt.split("");
        let displayedMonth = dateArray.slice(5, 7).join("");
        let displayedDay = dateArray.slice(8, 10).join("");
        let displayedYear = dateArray.slice(0, 4).join("");
        var displayedDate = `${displayedMonth} - ${displayedDay} - ${displayedYear}`;
    }

    // get post's info
    useEffect(() => {
        Axios.get(`http://localhost:8800/api/posts/${params.postId}/`)
          .then((response) => {
            setPostInfoState(response.data);
          })
          .catch((error) => {
            console.log(error.response);
          });
    }, [liked])

    // on mounting, check if the post is liked by you or not 
    useEffect(() => {
        if (postInfoState) {
            if (postInfoState.usersWhoveLiked.includes(currentUserState.username)) {
                setLiked(true);
            } else {
                setLiked(false);
            }    
        }
    }, [postInfoState])

    function navigateToProfileShowPage (e) {
        e.preventDefault();
        if (postInfoState.user === currentUserState.username) {
            navigate('/myProfile');
        } else {
            navigate(`/profileShowPage/${e.target.innerText}`);
        }
    }

    function sendNotificationForLike (username, postId) {
        var notificationBody = {
            message: `${currentUserState.username} has liked your post ${postId}.`,
            user: username
        }
        Axios.post(`http://localhost:8800/api/notifications/${username}`, notificationBody)
            .then((response) => {
                // console.log(response.data);
            })
            .catch((error) => {
                // console.log(error.response);
            })
    }

    function handleLike () {
        // liking it

        if (!liked) {
            let newData = postInfoState.usersWhoveLiked;
            if (!newData.includes(currentUserState.username)) {
               newData.push(currentUserState.username); 
            }
            let newDataObject = {usersWhoveLiked: newData};
            Axios.put(`http://localhost:8800/api/posts/${postInfoState._id}`, newDataObject)
                .then((response) => {
                    setLiked(true);
                })
                .catch((error) => {
                    console.log(error.reponse)
                })

            // send notification to THAT user about the like

            sendNotificationForLike(postInfoState.user, postInfoState._id);

        // unliking it
        } else {
            let newData = postInfoState.usersWhoveLiked.filter((user) => {
                return user !== currentUserState.username;
            })
            let newDataObject = {usersWhoveLiked: newData};
            Axios.put(`http://localhost:8800/api/posts/${postInfoState._id}`, newDataObject)
                .then((response) => {
                    setLiked(false);
                })
                .catch((error) => {
                    console.log(error.reponse)
                })
        }
    }

    function handleDeletePost () {
        Axios.delete(`http://localhost:8800/api/posts/${postInfoState._id}`);
        navigate('/myProfile');
    }

    if (postInfoState) {
        return (
            <div className='App-header'>
                <h1 className='link-to-profile-page' onClick={(e) => navigateToProfileShowPage(e)}>{postInfoState.user}</h1>
                
                <h1>{postInfoState.usersWhoveLiked.length} likes</h1>

                <h1>{postInfoState.caption}</h1>
                <h1>{displayedDate}</h1>
                <img className='single-post-image-in-home-feed' src={postInfoState.picUrl}></img>
                <br></br>

                {postInfoState.user !== currentUserState.username ? <button onClick={handleLike}>
                    {liked ? "Unlike" : "Like"}
                    </button>: <p>your post</p>}

                {postInfoState.user !== currentUserState.username ? <button>Comment</button>: <p>your post</p>}

                <button>Share</button>
                
                {postInfoState.user === currentUserState.username ? 
                    <button 
                        onClick={() => setToggledConfirm(true)}
                        className='btn btn-danger'
                    >Delete
                    </button>
                : ""
                }

                {/* show modal or not */}

                <div id="myModal" className={`modal ${toggledConfirm ? "yes-modal" : "" }`}>
                <div className={`modal-content`}>
                    <span onClick={() => setToggledConfirm(false)} className="close">&times;</span>
                    <h1 style={{color: 'red', fontSize: '30px'}}>Are you sure you want to delete?</h1>
                    <button style={{width: '50%', margin: 'auto'}} className='btn btn-primary btn-lg' onClick={() => setToggledConfirm(false)}>No</button>
                    <button style={{width: '50%', margin: 'auto'}} className='btn btn-danger btn-lg' onClick={handleDeletePost}>Yes</button>
                </div>
                </div>
            </div>
        )   
    }
    
}

export default PostShowPage