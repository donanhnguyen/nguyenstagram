import './App.css';
import { Link, BrowserRouter, Route, Routes} from 'react-router-dom';
import { GlobalProvider } from './GlobalContext';
import HomeFeed from './HomeFeed';
import SignUp from './SignUp';
import LogIn from './Login';
import NavBar from './NavBar';
import MyProfile from './MyProfile';

function App() {
  return (
      <GlobalProvider>
        
      <BrowserRouter>

        <NavBar />

        <Routes>

          <Route exact path='/' element={ <HomeFeed /> }></Route>
          <Route path='/login' element={ <LogIn /> }></Route>
          <Route path='/signup' element={ <SignUp /> }></Route>
          <Route path='/myProfile' element={ <MyProfile /> }></Route>

        </Routes>
        
      </BrowserRouter>

      </GlobalProvider>
  );
}

export default App;
