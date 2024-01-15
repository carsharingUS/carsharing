import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import HomePage from './pages/HomePage';
import HomePage2 from './pages/HomePage2';
import LoginComponent from './pages/login/LoginComponent'
import './App.css'
import InitialPage from './pages/InitialPage'
import Travels from './pages/travels/Travels';


function App() {
  return (

    <BrowserRouter >
    <Toaster />
      <Routes>
        <Route path='/'>
          <Route path='home' element={<HomePage />} />
          <Route path='' element={<HomePage />} />
          <Route path='initial' element={<InitialPage />} />
          <Route path='login' element={<LoginComponent />}/>
          <Route path='travels' element={<Travels />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;