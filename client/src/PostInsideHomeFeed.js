import {useState, useEffect, useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import Axios from 'axios';
import GlobalContext from './GlobalContext';

function PostInsideHomeFeed (props) {

    const [liked, setLiked] = useState();
    const navigate = useNavigate();

    const [postInsideFeedState, setPostInsideFeedState] = useState();
    const [showCommentInput, toggleShowCommentInput] = useState(false);
    const [showComments, toggleShowComments] = useState(false);
    const [commentInputState, setCommentInputState] = useState('');

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

    useEffect(() => {

        Axios.get(`http://localhost:8800/api/posts/${post._id}`)
            .then((response) => {
                setPostInsideFeedState(response.data);
            })
    // dependency array, refresh the post info everytime adding a like, or adding a comment
    }, [liked])

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
            let newData = post.usersWhoveLiked;
            if (!newData.includes(currentUserState.username)) {
               newData.push(currentUserState.username); 
            }
            let newDataObject = {usersWhoveLiked: newData};
            Axios.put(`http://localhost:8800/api/posts/${post._id}`, newDataObject)
                .then((response) => {
                    setLiked(true);
                })
                .catch((error) => {
                    console.log(error.reponse)
                })

            // send notification to THAT user about the like

            sendNotificationForLike(post.user, post._id);

        // unliking it
        } else {
            let newData = post.usersWhoveLiked.filter((user) => {
                return user !== currentUserState.username;
            })
            let newDataObject = {usersWhoveLiked: newData};
            Axios.put(`http://localhost:8800/api/posts/${post._id}`, newDataObject)
                .then((response) => {
                    setLiked(false);
                })
                .catch((error) => {
                    console.log(error.reponse)
                })
        }
        
    }

    function navigateToPostShowPage () {
        navigate(`/postShowPage/${post._id}`);
    }

    function navigateToProfileShowPage (e) {
        e.preventDefault();
        if (post.user === currentUserState.username) {
            navigate('/myProfile');
        } else {
            navigate(`/profileShowPage/${e.target.innerText}`);
        }
    }

    function handlePostComment () {
        
        
        if (commentInputState.split("").length === 0 || commentInputState === '') {
            console.log("cant be blank!");
        } else {

            // create comment object

            var postComments = postInsideFeedState.comments;
            var commentBody = {
                user: currentUserState.username,
                text: commentInputState
            };
            postComments.push(commentBody);
            var newCommentData = {comments: postComments};

            // PUT call to update post.comments

            Axios.put(`http://localhost:8800/api/posts/${postInsideFeedState._id}`, newCommentData)
                .then((response) => {
                    // console.log(response.data);
                    toggleShowCommentInput(false);
                    setCommentInputState("");
                })
                
            // send notification here
            var notificationBody = {
                message: `${currentUserState.username} has commented on your post: '${commentInputState}'.`,
                postIdLink: postInsideFeedState._id,
                user: post.user
            }

              Axios.post(`http://localhost:8800/api/notifications/${post.user}`, notificationBody)
                  .then((response) => {
                    //   console.log(response.data);
                  })
                  .catch((error) => {
                      // console.log(error.response);
                  })
            
        }
        
    }

    function showCommentInputOrNot () {
        if (showCommentInput) {
            return (
                <div>
                    <input 
                        type='text' 
                        placeholder='Comment...'
                        value={commentInputState}
                        onChange={(e) => setCommentInputState(e.target.value)}
                    ></input>
                    <button onClick={handlePostComment}>Post</button>
                </div>
            )
        }
    }

    function showCommentsOrNot () {
        if (showComments) {
            const commentsDisplayed = postInsideFeedState.comments.map((comment) => {
                return (
                    <li>{comment.user}: {comment.text}</li>
                )
            });
            return commentsDisplayed;
        }
    }

    return (
            <div 
                className='home-feed-post-container' 
                key={post._id}
            >
                <h1 className='link-to-profile-page' onClick={(e) => navigateToProfileShowPage(e)}>{post.user}</h1>
                <h1>{post.caption}</h1>
                <h1>{displayedDate}</h1>
                <img 
                    onClick={navigateToPostShowPage}
                    className='single-post-image-in-home-feed post-pic-link' src={post.picUrl}
                ></img>
                <br></br>

                {/* # of likes */}
                
                <h1>{postInsideFeedState ? postInsideFeedState.usersWhoveLiked.length + " likes": ""}</h1>


                {/* # of comments */}
                <h1>{postInsideFeedState ? postInsideFeedState.comments.length + " comments": ""}</h1>

                {/* toggling comments */}
                <h1 
                    className='toggleSomething'
                    onClick={() => toggleShowComments((prevState) => !prevState)}
                >
                    {showComments? "Hide Comments" : "View Comments"}
                </h1>
                
                {/* displaying comments */}
                <ul className='commentsListContainer'>
                    {showCommentsOrNot()}
                </ul>

                {post.user !== currentUserState.username ? <button onClick={handleLike}>
                    {liked ? "Unlike" : "Like"}
                    </button>: <p>your post</p>}
                    
                {post.user !== currentUserState.username ? 
                    <button onClick={() => toggleShowCommentInput((prevState) => !prevState)}>Comment</button>
                    : 
                    <p>your post</p>
                }
            
                <br></br>

                {/* showing comment input */}
                {showCommentInputOrNot()}

            </div>
        );
}

export default PostInsideHomeFeed;