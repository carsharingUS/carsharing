import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LoginComponent from './pages/login/LoginComponent'
import './App.css'
import InitialPage from './pages/InitialPage'


function App() {
  return (

    <BrowserRouter >
      <Routes>
        <Route path='/'> 
          <Route path='' element={<HomePage />} />
          <Route path='initial' element={<InitialPage />} />
          <Route path='login' element={<LoginComponent />}/>
          <Route path='register' element={<RegisterPage />} />
        </Route>
      </Routes>
    </BrowserRouter>

  );
}

export default App;