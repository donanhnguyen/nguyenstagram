import './App.css';
import { Link, BrowserRouter, Route, Routes} from 'react-router-dom';
import { GlobalProvider } from './GlobalContext';
import HomeFeed from './HomeFeed';
import SignUp from './SignUp';
import LogIn from './Login';

function App() {
  return (
      <GlobalProvider>

      <BrowserRouter>
        <Routes>

          <Route exact path='/' element={ <HomeFeed /> }></Route>
          <Route path='/login' element={ <LogIn /> }></Route>
          <Route path='/signup' element={ <SignUp /> }></Route>

        </Routes>
      </BrowserRouter>

      </GlobalProvider>
  );
}

export default App;
