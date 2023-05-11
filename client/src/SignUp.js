import {useState, useContext} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import Axios from 'axios';
import GlobalContext from './GlobalContext';

function SignUp () {

    const [errorMessagesState, setErrorMessagesState] = useState("");
    const [usernameState, setUsernameState] = useState("");
    const [passwordState, setPasswordState] = useState("");
    const [confirmPasswordState, setConfirmPasswordState] = useState("")
    const navigate = useNavigate();

    const {
        currentUserState,
        setCurrentUserState
    } = useContext(GlobalContext);

    function handleRegister (e) {
        e.preventDefault();
        if (usernameState === "" || passwordState === "" || confirmPasswordState === "") {
            setErrorMessagesState("Field's can't be blank!")
        } else if (passwordState !== confirmPasswordState) {
            setErrorMessagesState("Passwords don't match.");
        } else {

            let newUser = {
                username: usernameState,
                password: passwordState
            };

            Axios.post(`http://localhost:8800/api/auth/register/`, newUser)
                .then((response) => {
                    setTimeout(() => {
                        setCurrentUserState(response.data)
                        navigate('/');
                    }, 1000)
                })
                .catch((error) => {
                    setErrorMessagesState("Username has already been taken.");
                })
        }
        
    }

    return (
        <div className='App-header'>
            <div className='login-page-container'>

                        
            <div>
                <img className='login-image-pic' src={require("./images/home-image0.jpg")}></img>
            </div>

            <div className='login-container'>
                <form onSubmit={handleRegister}>
                    {/* logo goes here somewhere */}
                    <h1 style={{fontSize: '1.5em'}} className='nguyenstagram'>Nguyenstagram</h1>

                    <h1 className='login-error-messages'>{errorMessagesState}</h1>

                    <label htmlFor='username'>Username</label>
                    <br></br>
                    <input onChange={(e) => setUsernameState(e.target.value)} id='username' type='text'></input>
                    
                    <br></br>

                    <label htmlFor='password'>Password</label>
                    <br></br>
                    <input onChange={(e) => setPasswordState(e.target.value)} id='password' type='text'></input>
                    
                    <br></br>
                    
                    <label htmlFor='confirmPassword'>Confirm Password</label>
                    <br></br>
                    <input onChange={(e) => setConfirmPasswordState(e.target.value)} id='confirmPassword' type='text'></input>
                    
                    <br></br>

                    <button className='btn btn-primary' type='submit'>Register</button> 
                </form>


                <br></br>

                <h1 style={{fontSize: '1em'}}>Already have an account? Click <Link to='/login'>Here</Link> to log in.</h1>
            </div>

            </div>
            
        </div>
    )

}

export default SignUp;
