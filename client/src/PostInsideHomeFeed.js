import {useState, useEffect, useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import Axios from 'axios';
import GlobalContext from './GlobalContext';
import { Button } from 'react-bootstrap';
import Image from 'react-bootstrap/Image'

function PostInsideHomeFeed (props) {

    // liking functionality
    const [liked, setLiked] = useState();
    const navigate = useNavigate();

    const [postInsideFeedState, setPostInsideFeedState] = useState();

    // comments functionality
    const [showComments, toggleShowComments] = useState(false);
    const [commentInputState, setCommentInputState] = useState('');

    // sharing functionality
    const [allUsersState, setAllUsersState] = useState();
    const [selectedSharePerson, setSelectedSharePerson] = useState();
    const [showShareModal, toggleShareModal] = useState(false);
    const [searchFieldState, setSearchFieldState] = useState("");
    const [successfulShare, setSuccessfulShare] = useState(false);

    // sharing error functionality 
    const [shareErrorState, setShareErrorState] = useState();

    const {
        currentUserState,
        renderURL
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
        // initially setting the post state info from the post received from props
        setPostInsideFeedState(post);
    }, [])

    function sendNotificationForLike (username, postId) {
        var notificationBody = {
            message: `${currentUserState.username} has liked your post ${postId}.`,
            user: username,
            postIdLink: postId
        }
        Axios.post(`${renderURL}/api/notifications/${username}`, notificationBody);
    }

    function handleLike () {

        // liking it

        if (!liked) {
            let newData = post.usersWhoveLiked;
            if (!newData.includes(currentUserState.username)) {
               newData.push(currentUserState.username); 
            }
            let newDataObject = {usersWhoveLiked: newData};
            Axios.put(`${renderURL}/api/posts/${post._id}`, newDataObject)
                .then((response) => {
                    setPostInsideFeedState(response.data);
                    setLiked(true);
                })
            
            // send notification to THAT user about the like ONLY if ur not liking your own post
            if (currentUserState.username !== postInsideFeedState.user) {
                sendNotificationForLike(post.user, post._id);
            }
            
        // unliking it
        } else {
            let newData = post.usersWhoveLiked.filter((user) => {
                return user !== currentUserState.username;
            })
            let newDataObject = {usersWhoveLiked: newData};
            Axios.put(`${renderURL}/api/posts/${post._id}`, newDataObject)
                .then((response) => {
                    setPostInsideFeedState(response.data);
                    setLiked(false);
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
            navigate(`/profileShowPage/${post.user}`);
        }
    }

    function navigateToProfileShowPageFromComment (e, user) {
        e.preventDefault();
        if (user === currentUserState.username) {
            navigate('/myProfile');
        } else {
            navigate(`/profileShowPage/${user}`);
        }
    }

    function handlePostComment () {
        
        if (commentInputState.split("").length !== 0 && commentInputState !== '') {
            // create comment object

            var postComments = postInsideFeedState.comments;
            var commentBody = {
                user: currentUserState.username,
                text: commentInputState,
                datePosted: new Date()
            };
            postComments.push(commentBody);
            var newCommentData = {comments: postComments};

            // PUT call to update post.comments

            Axios.put(`${renderURL}/api/posts/${postInsideFeedState._id}`, newCommentData)
                .then((response) => {
                    setCommentInputState("");
                    setPostInsideFeedState(response.data);
                })
                
            // send notification here, but DONT send it if ur commenting on your own post.
            if (currentUserState.username !== postInsideFeedState.user) {
                var notificationBody = {
                    message: `${currentUserState.username} has commented on your post: '${commentInputState}'.`,
                    postIdLink: postInsideFeedState._id,
                    user: post.user
                }

                Axios.post(`${renderURL}/api/notifications/${post.user}`, notificationBody)
                   
            }
        }
        
    }

    function showCommentInput () {
            return (
                <div>
                    <input
                        style={{width: '80%'}} 
                        type='text' 
                        placeholder='Comment...'
                        value={commentInputState}
                        onChange={(e) => setCommentInputState(e.target.value)}
                    ></input>
                    
                    <button 
                        style={{width: '20%', padding: '1px'}} 
                        className='post-comment-button'
                        onClick={handlePostComment}
                    >Post</button>
                    
                </div>
            )
    }

    function showCommentsOrNot () {
        if (showComments) {
            const commentsDisplayed = postInsideFeedState.comments.map((comment, i) => {

                let commentDate;

                if (comment.datePosted) {
                    commentDate = comment.datePosted.split("").slice(0,10).join("");
                } 
            
                return (
                    <li key={comment._id + i} className='single-comment textAlignLeft'>
                       <p style={{fontSize: '11px'}}>{commentDate}</p> 
                       <span 
                            onClick={(e) => navigateToProfileShowPageFromComment(e, comment.user)} 
                            className='any-link'>{comment.user}:
                       </span> 
                       <span> { comment.text }</span>
                    </li>
                )
            });
            return commentsDisplayed.reverse();
        }
    }

    // sharing functionality
    function openUpShareModal () {
        toggleShareModal(true);
        Axios.get(`${renderURL}/api/users/`)
            .then((response) => setAllUsersState(response.data))
    }

    function displaySearchResults () {
        // filter based on search field, if the username startsWith the search field input
            var allUsers = [];

            for (let i in allUsersState) {
                let currentUser = allUsersState[i];
                if (currentUser.username.startsWith(searchFieldState) && currentUserState.username !== currentUser.username) {
                    allUsers.push(currentUser);
                }
            }

            const displayed = allUsers.map((user) => {
                return (
                    <li 
                        onClick={() => setSelectedSharePerson(user.username)}
                        className='search-entry' 
                        key={user._id}
                    >
                        <img 
                            className='profile-pic-inside-search-bar'
                            src={user.profilePic}
                        >
                        </img>
                        {user.username}
                    </li>
                )
            })

            return displayed;    
  
    }

    function handleSharePost () {

        // sending notificaiton
        var notificationBody = {
            message: `${currentUserState.username} has shared a post with you: ${postInsideFeedState._id}.`,
            postIdLink: postInsideFeedState._id,
            user: selectedSharePerson
        }
        // POST call to notifications
        Axios.post(`${renderURL}/api/notifications/${selectedSharePerson}`, notificationBody)
            .then((response) => {
                // clear and reset all inputs
                toggleShareModal(false);
                setSelectedSharePerson(null);
                setSearchFieldState('');
                // success modal
                setSuccessfulShare(true);
                setTimeout(() => {
                    setSuccessfulShare(false);
                }, 2000)
            })
            .catch((error) => {
                setShareErrorState(`You have already shared this post with ${selectedSharePerson}.`);
                setTimeout(() => {
                    setShareErrorState(null);
                    setSelectedSharePerson(null);
                }, 2000)
            })
    }

    return (
            <div 
                className='home-feed-post-container' 
                key={post._id}
            >

                {/* username and date posted */}
                <h1 
                    className='link-to-profile-page' 
                    onClick={(e) => navigateToProfileShowPage(e)}
                    style={{float: 'left'}}
                >
                    {post.userProfile.profilePic ? <img className='profilePicInHomeFeed' src={`${post.userProfile.profilePic}`}></img> : ""}
                    {post.user}
                </h1>
                <h1 style={{float: 'right'}}
                    className=''
                >{displayedDate}
                </h1>

                {/* post image */}
                <Image thumbnail={true} src={post.picUrl} className='single-post-image-in-home-feed post-pic-link' onClick={navigateToPostShowPage}></Image>

                {/* <img 
                    onClick={navigateToPostShowPage}
                    className='single-post-image-in-home-feed post-pic-link' src={post.picUrl}
                ></img> */}
                <br></br>

                {/* caption */}
                <h1 className='home-feed-post-caption'>{post.caption}</h1>

                {/* like button */}
                {
                    liked ?
                    <i onClick={handleLike} className="fa fa-heart heart-like" style={{color: 'red'}}></i>
                    :
                    <i onClick={handleLike} className="fa fa-heart-o heart-like"></i>
                }

                {/* share button */}
                <i onClick={openUpShareModal} className="anyIcon fa fa-share-square" aria-hidden="true"></i>
                
                {/* # of likes and comments */}
                <h1 className='textAlignLeft'>{postInsideFeedState ? postInsideFeedState.usersWhoveLiked.length + " likes": ""}</h1>
                <h1 className='textAlignLeft'>{postInsideFeedState && postInsideFeedState.comments ? postInsideFeedState.comments.length + " comments": ""}</h1>

                {/* toggling comments */}
                <h1 
                    className='toggleSomething textAlignLeft'
                    onClick={() => toggleShowComments((prevState) => !prevState)}
                >
                    {showComments? "Hide Comments" : "View Comments"}
                </h1>
                
                {/* displaying comments */}
                <ul className='commentsListContainer'>
                    {showCommentsOrNot()}
                </ul>

                {/* showing comment input */}
                {showCommentInput()}

                {/* show sharing modal or not */}
                <div id="myModal" className={`modal ${showShareModal ? "yes-modal" : "" }`}>
                    <div className={`modal-content`}>
                        <span onClick={() => toggleShareModal(false)} className="close">&times;</span>
                        
                        <h1>Share</h1>
                        <input 
                            onChange={(e) => setSearchFieldState(e.target.value)} 
                            value={searchFieldState}
                            placeholder='Search User...'
                            type='text'>
                        </input>
                        <ul>
                            {displaySearchResults()}
                        </ul>

                        {selectedSharePerson ?
                        <div>
                                <h1>Sharing post to {selectedSharePerson}</h1>

                                <button 
                                    onClick={() => toggleShareModal(false)}
                                    className='btn btn-secondary'
                                >
                                    Cancel
                                </button>

                                <button
                                    className='btn btn-primary'
                                    onClick={handleSharePost}
                                >
                                    Share
                                </button>

                                <h1>{shareErrorState}</h1>
                        </div>
                        :
                        ""
                        }

                    </div>
                </div>

                {/* show modal of successful share */}
                <div id="myModal" className={`modal ${successfulShare ? "yes-modal" : "" }`}>
                    <div className={`modal-content`}>
                        <h1 style={{color: 'green', fontSize: '30px'}}>Successfully Shared!</h1>
                    </div>
                </div>
                
                
            </div>
        );
}

export default PostInsideHomeFeed;