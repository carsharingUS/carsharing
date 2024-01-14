import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import HomePage from './pages/HomePage';
import HomePage2 from './pages/HomePage2';
import LoginComponent from './pages/login/LoginComponent'
import './App.css'
import InitialPage from './pages/InitialPage'


function App() {
  return (

    <BrowserRouter >
    <Toaster />
      <Routes>
        <Route path='/'> 
          <Route path='' element={<HomePage2 />} />
          <Route path='initial' element={<InitialPage />} />
          <Route path='login' element={<LoginComponent />}/>
          <Route path='home' element={<HomePage />} />
        </Route>
      </Routes>
    </BrowserRouter>

  );
}

export default App;