import {useState, useEffect, useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import Axios from 'axios';
import GlobalContext from './GlobalContext';
import PostInsideHomeFeed from './PostInsideHomeFeed';
import Loader from './Loader';
import './CreatePostModal.css'
import CreatePostFormFromHomePage from './CreatePostFormFromHomePage';
import Image from 'react-bootstrap/Image'

function HomeFeed () {

    const {
        currentUserState,
        setCurrentUserState,
        renderURL,
        toggleIsLoading,
        isLoading
    } = useContext(GlobalContext);

    const [allPostsState, setAllPostsState] = useState();
    const [showModal, setShowModal] = useState(false);

    const navigate = useNavigate();

    function getAllPosts () {
        toggleIsLoading(true);
        Axios.get(`${renderURL}/api/posts/`)
                .then((response) => {
                    setAllPostsState(response.data);
                    toggleIsLoading(false);
                })
                .catch((error) => {
                    console.log(error);
                })
    }

    function refreshAllPosts () {
        toggleIsLoading(true);
        Axios.get(`${renderURL}/api/posts/`)
                .then((response) => {
                    setAllPostsState(response.data);
                    toggleIsLoading(false);
                })
                .catch((error) => {
                    console.log(error);
                })
    }

    useEffect(() => {
        const localStorageUserInfo = localStorage.getItem("user");
        if (localStorageUserInfo) {
            getAllPosts();
            setCurrentUserState(JSON.parse(localStorage.getItem("user")));
        } else if (currentUserState) {
            getAllPosts();
        } else {
            navigate("/login");
        }
    }, []) 

    function displayHomePagePosts () {
        if (allPostsState) {
            const dispalyedPosts = allPostsState.map((post) => {
                return (<PostInsideHomeFeed key={post._id} post={post}/>)
            })           
            return dispalyedPosts.reverse();
        }
    }
    if (isLoading) {
        return (<Loader/>)
    } else {
        return (
            <div className='App-header'>
                    <CreatePostFormFromHomePage 
                        showModal={showModal}
                        setShowModal={setShowModal}
                        refreshAllPosts={refreshAllPosts}
                    />
                <div className='home col-sm-12 col-md-6 col-lg-4'>
                    {displayHomePagePosts()}
                </div>
                    
                <div className="floating-button">
                    <button onClick={() => setShowModal(true)} className="round-button">+</button>
                </div>
            </div>
        )    
    }
    
}

export default HomeFeed;