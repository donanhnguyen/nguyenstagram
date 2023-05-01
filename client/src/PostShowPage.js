import {useState, useEffect, useContext} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './App.css';
import Axios from 'axios';
import GlobalContext from './GlobalContext';

function PostShowPage () {

    const params = useParams();
    const [postInfoState, setPostInfoState] = useState();
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

    useEffect(() => {
        Axios.get(`http://localhost:8800/api/posts/${params.postId}/`)
          .then((response) => {
            setPostInfoState(response.data);
          })
          .catch((error) => {
            console.log(error.response);
          });
    }, [])

    function navigateToProfileShowPage (e) {
        e.preventDefault();
        if (postInfoState.user === currentUserState.username) {
            navigate('/myProfile');
        } else {
            navigate(`/profileShowPage/${e.target.innerText}`);
        }
    }

    if (postInfoState) {
        return (
            <div>
                <h1 className='link-to-profile-page' onClick={(e) => navigateToProfileShowPage(e)}>{postInfoState.user}</h1>
                
                <h1>{postInfoState.usersWhoveLiked.length} likes</h1>

                <h1>{postInfoState.caption}</h1>
                <h1>{displayedDate}</h1>
                <img className='single-post-image-in-home-feed' src={postInfoState.picUrl}></img>
                <br></br>
            </div>
        )   
    }
    
}

export default PostShowPage