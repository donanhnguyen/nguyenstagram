import {useState, useContext, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import Axios from 'axios';
import GlobalContext from './GlobalContext';

function SignUp () {

    const navigate = useNavigate();

    const {
        setCurrentUserState,
        renderURL
    } = useContext(GlobalContext);

    // username and pw
    const [errorMessagesState, setErrorMessagesState] = useState("");
    const [usernameState, setUsernameState] = useState("");
    const [passwordState, setPasswordState] = useState("");
    const [confirmPasswordState, setConfirmPasswordState] = useState("")
    const [successfulLogin, setSuccessfulLogin] = useState(false);

    // image uploading

    const [imageUrl, setImageUrl] = useState();

    function convertToBase64 (file) {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
                resolve(fileReader.result);
            };
            fileReader.onerror = (error) => {
                reject(error);
            }
        })
    }

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        const base64 = await convertToBase64(file);
        setImageUrl(base64);
    }
    // end of image uploading

    function handleRegister (e) {
        e.preventDefault();
        if (usernameState === "" || passwordState === "" || confirmPasswordState === "") {
            setErrorMessagesState("Field's can't be blank!")
        } else if (usernameState.length < 3 || passwordState.length < 3) {
            setErrorMessagesState("Username & password must be at least 3 characters.")
        } else if (passwordState !== confirmPasswordState) {
            setErrorMessagesState("Passwords don't match.");
        } else {

            let newUser;
            
            if (!imageUrl) {
                newUser = {
                    username: usernameState,
                    password: passwordState,
                    profilePic: 'https://t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg',
                };
            } else {
                newUser = {
                    username: usernameState,
                    password: passwordState,
                    profilePic: imageUrl,
                };
            }

            Axios.post(`${renderURL}/api/auth/register/`, newUser)
                .then((response) => {
                    setSuccessfulLogin(true);
                    setCurrentUserState(response.data);
                    setTimeout(() => {
                        setSuccessfulLogin(false);
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
     
            <div className='loginImageContainer'>
            </div>

            <div className='login-container'>
                <form onSubmit={handleRegister}>

                    <h1 style={{fontSize: '1.5em'}} className='nguyenstagram'>Nguyenstagram <i className="fa fa-camera" aria-hidden="true"></i></h1>

                    <h1 style={{fontSize: '1.0em'}} className='login-error-messages'>{errorMessagesState}</h1>

                    <label htmlFor='username'>Username</label>
                    <br></br>
                    <input onChange={(e) => setUsernameState(e.target.value)} id='username' type='text'></input>
                    
                    <br></br>

                    <label htmlFor='password'>Password</label>
                    <br></br>
                    <input onChange={(e) => setPasswordState(e.target.value)} id='password' type='password'></input>
                    
                    <br></br>
                    
                    <label htmlFor='confirmPassword'>Confirm Password</label>
                    <br></br>
                    <input onChange={(e) => setConfirmPasswordState(e.target.value)} id='confirmPassword' type='password'></input>
                    
                    <br></br>
                
                    {/* upload image via link */}
                    {/* <label>Profile Pic URL <i className="fa fa-picture-o" aria-hidden="true"></i></label>
                    <br></br>
                    <input type='text' onChange={(e) => setImageUrl(e.target.value)} value={imageUrl}></input> */}

                    <br></br>

                    {/* upload image via upload */}
                    <div className="file-input">
                        <input className='file' id='file' type='file' accept='image/*' onChange={(e) => handleFileUpload(e)}></input>
                        <label htmlFor="file">Upload Profile Pic</label>
                    </div>

                    {/* preview image */}
                    {imageUrl?
                    <img className='previewImageSignUp' style={{height: '150px', width: '200px'}} src={imageUrl}></img>
                    :
                    ""}

                    <br/>
                    <button className='btn btn-primary' type='submit'>Register</button> 
                </form>


                <br></br>

                <h1 style={{fontSize: '1em'}}>Already have an account? Click <Link to='/login'>Here</Link> to log in.</h1>
            </div>

            </div>
            {/* modal */}
            <div id="myModal" className={`modal ${successfulLogin ? "yes-modal" : "" }`}>
                    <div className={`modal-content`}>
                        <h1 style={{color: 'green', fontSize: '30px'}}>Registered!</h1>
                    </div>
            </div>
        </div>
    )

}

export default SignUp;
