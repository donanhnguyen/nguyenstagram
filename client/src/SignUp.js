import {useState, useContext, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import Axios from 'axios';
import GlobalContext from './GlobalContext';

function SignUp () {

    const navigate = useNavigate();

    const {
        setCurrentUserState
    } = useContext(GlobalContext);

    // username and pw
    const [errorMessagesState, setErrorMessagesState] = useState("");
    const [usernameState, setUsernameState] = useState("");
    const [passwordState, setPasswordState] = useState("");
    const [confirmPasswordState, setConfirmPasswordState] = useState("")

    // const [profilePicState, setProfilePicState] = useState("");

    // image uploading

    const [image, setImage] = useState();
    const [imageUrl, setImageUrl] = useState();

    useEffect(() => {
        if (image) {
            var picUrl = URL.createObjectURL(image[0]);
            setImageUrl(picUrl);
        }
    }, [image])

    function onImageChange (e) {
        setImage(e.target.files);
    }

    function handleRegister (e) {
        e.preventDefault();
        if (usernameState === "" || passwordState === "" || confirmPasswordState === "" || imageUrl === "") {
            setErrorMessagesState("Field's can't be blank!")
        } else if (passwordState !== confirmPasswordState) {
            setErrorMessagesState("Passwords don't match.");
        } else {

            let newUser = {
                username: usernameState,
                password: passwordState,
                profilePic: imageUrl,
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
     
            <div className='loginImageContainer'>
            </div>

            <div className='login-container'>
                <form onSubmit={handleRegister}>

                    <h1 style={{fontSize: '1.5em'}} className='nguyenstagram'>Nguyenstagram</h1>

                    <h1 style={{fontSize: '1.0em'}} className='login-error-messages'>{errorMessagesState}</h1>

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
                


                    {/* upload image via link */}
                    <label>Profile Pic URL <i className="fa fa-picture-o" aria-hidden="true"></i></label>
                    <br></br>
                    <input type='text' onChange={(e) => setImageUrl(e.target.value)} value={imageUrl}></input>

                    <br></br>

                    {/* upload image via upload */}
                    {/* <div className="file-input">
                        <input className='file' id='file' type='file' accept='image/*' onChange={onImageChange}></input>
                        <label htmlFor="file">Upload Profile Pic</label>
                    </div> */}

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
            
        </div>
    )

}

export default SignUp;
