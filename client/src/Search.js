import './App.css';
import {useState, useContext, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import Axios from 'axios';
import GlobalContext from './GlobalContext';

function Search (props) {

    const {
        currentUserState,
        renderURL
    } = useContext(GlobalContext);
    
    const {
      showSearch,
      toggleShowSearch
    } = props;
    
    const navigate = useNavigate();

    const [allUsersState, setAllUsersState] = useState();
    const [searchFieldState, setSearchFieldState] = useState("");

    useEffect(() => {
        Axios.get(`${renderURL}/api/users/`)
            .then((response) => setAllUsersState(response.data))    
    }, [])

    function navigateToProfile (username) {
        if (currentUserState.username === username) {
            navigate('/myProfile')
        } else {
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
            <h1 className="toggleSomething" onClick={() => toggleShowSearch((prevState) => !prevState)}><i className="fa fa-search" aria-hidden="true"></i> Search</h1>
        )  
    } else {
        return (
            <div className='searchContainer'>

                <h1 
                    className='toggleSomething'
                    onClick={() => toggleShowSearch((prevState) => !prevState)}
                    >
                    <i className="fa fa-search" aria-hidden="true"></i> Search
                </h1>

                <input 
                    onChange={(e) => setSearchFieldState(e.target.value)} 
                    value={searchFieldState}
                    type='text'
                    style={{marginBottom: '20px'}}>
                </input>
                <ul>
                    {displaySearchResults()}
                </ul>

            </div>
        )
    }
    
}

export default Search;