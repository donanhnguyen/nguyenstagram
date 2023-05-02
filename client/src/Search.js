import './App.css';
import {useState, useContext, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import Axios from 'axios';
import GlobalContext from './GlobalContext';

function Search (props) {

    const {
        currentUserState,
    } = useContext(GlobalContext);
    
    const {
      showSearch,
      toggleShowSearch
    } = props;
    
    const navigate = useNavigate();

    if (!showSearch) {
        return (
            <h1 onClick={() => toggleShowSearch((prevState) => !prevState)}>Search</h1>
        )  
    } else {
        return (
            <div >

                <h1 onClick={() => toggleShowSearch((prevState) => !prevState)}>
                    Showing Search bar here
                </h1>
                
            </div>
        )
    }
    
}

export default Search;