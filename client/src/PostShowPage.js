import {useState, useEffect, useContext} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './App.css';
import './Modals.css';
import './ThreeDots.css';
import Axios from 'axios';
import GlobalContext from './GlobalContext';

function PostShowPage () {

    const params = useParams();

    // post info and deleting post
    const [postInfoState, setPostInfoState] = useState();
    const [toggledConfirm, setToggledConfirm] = useState(false);
    const [profilePic, setProfilePic] = useState();

    // comment functionality
    const [showComments, toggleShowComments] = useState(false);
    const [commentInputState, setCommentInputState] = useState('');

    // share functionality
    const [allUsersState, setAllUsersState] = useState();
    const [selectedSharePerson, setSelectedSharePerson] = useState();
    const [showShareModal, toggleShareModal] = useState(false);
    const [searchFieldState, setSearchFieldState] = useState("");
    const [successfulShare, setSuccessfulShare] = useState(false);

    // sharing error functionality 
    const [shareErrorState, setShareErrorState] = useState();

    // liking functionality
    const [liked, setLiked] = useState();

    const navigate = useNavigate();

    const {
        currentUserState,
        renderURL
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
        Axios.get(`${renderURL}/api/posts/${params.postId}/`)
          .then((response) => {
            setPostInfoState(response.data);
          })
          .catch((error) => {
            console.log(error.response);
          });
    }, [liked, showComments, params.postId])

    // get the user's info so we can display their profile pic
    useEffect(() => {
        if (postInfoState) {
           Axios.get(`${renderURL}/api/users/${postInfoState.user}/`)
            .then((response) => {
              setProfilePic(response.data.profilePic);
            })
            .catch((error) => {
              console.log(error.response);
            }); 
        }
      }, [postInfoState])

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
            navigate(`/profileShowPage/${postInfoState.user}`);
        }
    }

    function sendNotificationForLike (username, postId) {
        var notificationBody = {
            message: `${currentUserState.username} has liked your post ${postId}.`,
            postIdLink: postId,
            user: username
        }
        Axios.post(`${renderURL}/api/notifications/${username}`, notificationBody)
    }

    function handleLike () {
        // liking it

        if (!liked) {
            let newData = postInfoState.usersWhoveLiked;
            if (!newData.includes(currentUserState.username)) {
               newData.push(currentUserState.username); 
            }
            let newDataObject = {usersWhoveLiked: newData};
            Axios.put(`${renderURL}/api/posts/${postInfoState._id}`, newDataObject)
                .then((response) => {
                    setLiked(true);
                })
                .catch((error) => {
                    console.log(error.reponse)
                })

            // send notification to THAT user about the like, unless ur liking ur own post
            if (currentUserState.username !== postInfoState.user) {
                sendNotificationForLike(postInfoState.user, postInfoState._id);
            }

        // unliking it
        } else {
            let newData = postInfoState.usersWhoveLiked.filter((user) => {
                return user !== currentUserState.username;
            })
            let newDataObject = {usersWhoveLiked: newData};
            Axios.put(`${renderURL}/api/posts/${postInfoState._id}`, newDataObject)
                .then((response) => {
                    setLiked(false);
                })
                .catch((error) => {
                    console.log(error.reponse)
                })
        }
    }

    function handleDeletePost () {
        Axios.delete(`${renderURL}/api/posts/${postInfoState._id}`);
        navigate('/myProfile');
    }

    function handlePostComment () {
        
        if (commentInputState.split("").length === 0 || commentInputState === '') {
            console.log("cant be blank!");
        } else {

            // create comment object

            var postComments = postInfoState.comments;
            var commentBody = {
                user: currentUserState.username,
                text: commentInputState
            };
            postComments.push(commentBody);
            var newCommentData = {comments: postComments};

            // PUT call to update post.comments

            Axios.put(`${renderURL}/api/posts/${postInfoState._id}`, newCommentData)
                .then((response) => {
                    setCommentInputState("");
                })
                
            // send notification here only if ur not commenting on own post
            if (currentUserState.username !== postInfoState.user) {
                var notificationBody = {
                    message: `${currentUserState.username} has commented on your post: '${commentInputState}'.`,
                    postIdLink: postInfoState._id,
                    user: postInfoState.user
                }
                Axios.post(`${renderURL}/api/notifications/${postInfoState.user}`, notificationBody)
            }
            
        }
        
    }

    function showCommentInput () {
            return (
                <div className='commentinputcontainer'>
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

    function handleDeleteComment (commentId) {
            var postComments = postInfoState.comments.filter((comment) => comment._id !== commentId);
            var newCommentData = {comments: postComments};
            // PUT call to update post.comments
            Axios.put(`${renderURL}/api/posts/${postInfoState._id}`, newCommentData)
                .then((response) => {
                    toggleShowComments(false);
                })
    }

    function showCommentsOrNot () {
        if (showComments) {
            const commentsDisplayed = postInfoState.comments.map((comment, i) => {
                let commentDate = new Date(comment.createdAt).toDateString();
                return (
                    <li key={comment._id + i} className='commentInsidePostShowPage'>
                        
                        <p style={{fontSize: '.6em'}}>{commentDate}</p>
                        
                            {comment.user === currentUserState.username ?
                                <h1 
                                    onClick={() => handleDeleteComment(comment._id)} 
                                    className='commentDelete'
                                    style={{float: 'right'}}
                                >Delete
                                </h1>
                                :
                                ""
                            }

                        <p>{comment.user}: {comment.text}</p>
 
                    </li>
                )
            });
            return commentsDisplayed.reverse();
        }
    }

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
            message: `${currentUserState.username} has shared a post with you: ${postInfoState._id}.`,
            postIdLink: postInfoState._id,
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

    if (postInfoState) {
        return (
            <div className='App-header'>
                <div className='postShowPageContainer'>

                <h1 style={{float: 'left'}} className='link-to-profile-page' onClick={(e) => navigateToProfileShowPage(e)}>
                    {profilePic? <img className='profilePicInPostShowPage' src={`${profilePic}`}></img> : ""}
                    {postInfoState.user}
                </h1>
                <h1 style={{float: 'right'}}>{displayedDate}</h1>
                
                <br></br>

                {/* pic */}
                <img className='postShowPagePic' src={postInfoState.picUrl}></img>
                
                {/* caption */}
                <h1 className='home-feed-post-caption'>{postInfoState.caption}</h1>
                
                {/* like, comment, and share buttons */}
                {
                    liked ?
                    <i onClick={handleLike} className="anyIcon fa fa-heart heart-like" style={{color: 'red'}}></i>
                    :
                    <i onClick={handleLike} className="anyIcon fa fa-heart-o heart-like"></i>
                }

                {/* Share button */}
                <i onClick={openUpShareModal} className="anyIcon fa fa-share-square" aria-hidden="true"></i>


                {/* # of likes and comments */}
                <h1>{postInfoState.usersWhoveLiked.length} likes</h1>

                <h1>{postInfoState.comments.length} comments</h1>

                

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

                {/* Comment input */}

                {showCommentInput()}

                {/* delete post */}
                {postInfoState.user === currentUserState.username ? 
                    <button 
                        onClick={() => setToggledConfirm(true)}
                        className='btn btn-danger'
                    >Delete Post
                    </button>
                : ""
                }

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

                {/* show modal of delete or not or not */}

                <div id="myModal" className={`modal ${toggledConfirm ? "yes-modal" : "" }`}>
                    <div className={`modal-content`}>
                        <span onClick={() => setToggledConfirm(false)} className="close">&times;</span>
                        <h1 style={{color: 'red', fontSize: '30px'}}>Are you sure you want to delete?</h1>
                        <button style={{width: '50%', margin: 'auto'}} className='btn btn-primary btn-lg' onClick={() => setToggledConfirm(false)}>No</button>
                        <button style={{width: '50%', margin: 'auto'}} className='btn btn-danger btn-lg' onClick={handleDeletePost}>Yes</button>
                    </div>
                </div>

                {/* show modal of successful share */}
                <div id="myModal" className={`modal ${successfulShare ? "yes-modal" : "" }`}>
                    <div className={`modal-content`}>
                        <h1 style={{color: 'green', fontSize: '30px'}}>Successfully Shared!</h1>
                    </div>
                </div>

                </div>
            </div>
        )   
    }
    
}

export default PostShowPage