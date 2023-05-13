import {useState, useContext, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import Axios from 'axios';
import GlobalContext from './GlobalContext';
import './SlideShow.css';

function LogIn () {

    const [errorMessagesState, setErrorMessagesState] = useState("");
    const [usernameState, setUsernameState] = useState("");
    const [passwordState, setPasswordState] = useState("");

    const {
        currentUserState,
        setCurrentUserState
    } = useContext(GlobalContext);

    const navigate = useNavigate();


    function handleLogIn (e) {
        e.preventDefault();
        if (usernameState === "" || passwordState === "") {
            setErrorMessagesState("Field's can't be blank!")
        } else {

            let loggedInUser = {
                username: usernameState,
                password: passwordState
            };

            Axios.post(`http://localhost:8800/api/auth/login/`, loggedInUser)
                .then((response) => {
                    setTimeout(() => {
                        setCurrentUserState(response.data)
                        navigate('/');
                    }, 1000)
                })
                .catch((error) => {
                    setErrorMessagesState(error.response.data)
                })
        }
        
    }

    return (
        <div className="App-header">
            <div className='login-page-container'>

            <div className='loginImageContainer'>
            </div>
           
            <div className='login-container'>
                <form onSubmit={handleLogIn}>
                    {/* logo goes here somewhere */}
                    <h1 style={{fontSize: '1.5em'}} className='nguyenstagram'>Nguyenstagram</h1>

                    <h1 className='login-error-messages'>{errorMessagesState}</h1>

                    <label htmlFor='username'>Username</label>
                    <br></br>
                    <input onChange={(e) => setUsernameState(e.target.value)} id='username' type='text'></input>
                    <br></br>
                    <label htmlFor='password'>Password</label>
                    <br></br>
                    <input onChange={(e) => setPasswordState(e.target.value)} id='password' type='password'></input>
                    
                    <br></br>

                    <button className='btn btn-primary' type='submit'>Log In</button> 
                </form>


                <br></br>

                <h1 style={{fontSize: '1em'}}>Don't have an account? Click <Link to='/signup'>Here</Link> to register.</h1>
            </div>

            </div>
        </div>
    )

}

export default LogIn;
