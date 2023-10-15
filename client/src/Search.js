import './App.css';
import {useState, useContext, useEffect, useRef} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import Axios from 'axios';
import GlobalContext from './GlobalContext';

function Search (props) {

    const {
        currentUserState,
        renderURL,
        toggleIsLoading
    } = useContext(GlobalContext);
    
    const {
      showSearch,
      toggleShowSearch
    } = props;

    const navigate = useNavigate();

    const [allUsersState, setAllUsersState] = useState();
    const [searchFieldState, setSearchFieldState] = useState("");

    useEffect(() => {
        if (showSearch) {
            Axios.get(`${renderURL}/api/users/`)
                .then((response) => setAllUsersState(response.data))    
        }
    }, [showSearch])

    function navigateToProfile (username) {
        if (currentUserState.username === username) {
            toggleShowSearch(false);
            setSearchFieldState("");
            navigate('/myProfile')
        } else {
            toggleShowSearch(false);
            setSearchFieldState("");
            navigate(`/profileShowPage/${username}/`, {state: {username: username} })
        }
    }

    function displaySearchResults () {
        // filter based on search field, if the username startsWith the search field input

        // if (allUsersState) {

            var allUsers = [];

            for (let i in allUsersState) {
                let currentUser = allUsersState[i];
                if (currentUser.username.startsWith(searchFieldState)) {
                    allUsers.push(currentUser);
                }
            }

            const displayed = allUsers.map((user) => {
                return (
                    <li onClick={() => navigateToProfile(user.username)} 
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
  
        // }
        
    }

    if (!showSearch) {
        return (
            <h1 className="toggleSomething" onClick={() => toggleShowSearch((prevState) => !prevState)}><i className="fa fa-search" aria-hidden="true"></i> <span className="hide-text">Search</span></h1>
        )  
    } else {
        return (

            <div id="myModal" className={`modal ${showSearch ? "yes-modal" : "" }`} onClick={() => toggleShowSearch(false)}>
                    <div className={`modal-content`} onClick={e => {e.stopPropagation();}}>
                        
                            <div className='searchContainer'>

                                <h1 
                                    style={{textAlign: 'center', fontSize: '2rem'}}
                                    className='toggleSomething'
                                    onClick={() => toggleShowSearch((prevState) => !prevState)}
                                    >
                                   X
                                </h1>

                                <input 
                                    onChange={(e) => setSearchFieldState(e.target.value)} 
                                    value={searchFieldState}
                                    type='text'
                                    placeholder='Search user...'
                                    style={{marginBottom: '20px', width: "100%"}}>
                                </input>
                                <ul>
                                    {displaySearchResults()}
                                </ul>

                            </div>

                    </div>
                </div>
            
        )
    }
    
}

export default Search;