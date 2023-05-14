import './App.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import { GlobalProvider } from './GlobalContext';
import HomeFeed from './HomeFeed';
import SignUp from './SignUp';
import LogIn from './Login';
import NavBar from './NavBar';
import MyProfile from './MyProfile';
import PostShowPage from './PostShowPage';
import ProfileShowPage from './ProfileShowPage';

function App() {
  return (
      <GlobalProvider>
        
      <BrowserRouter>
      <div className='all-container'>
        <NavBar />

        <Routes>

          <Route exact path='/' element={ <HomeFeed /> }></Route>
          <Route path='/login' element={ <LogIn /> }></Route>
          <Route path='/signup' element={ <SignUp /> }></Route>
          <Route path='/myProfile' element={ <MyProfile /> }></Route>
          <Route path='/profileShowPage/:username' element={ <ProfileShowPage /> }></Route>
          <Route path='/postShowPage/:postId' element={ <PostShowPage /> }></Route>

        </Routes>
      </div> 
      </BrowserRouter>

      </GlobalProvider>
  );
}

export default App;
