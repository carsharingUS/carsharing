import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import HomePage from './pages/HomePage';
import LoginComponent from './pages/login/LoginComponent'
import './App.css'
import InitialPage from './pages/InitialPage'
import Travels from './pages/travels/Travels';
import TravelCreationPage from './pages/travels/TravelCreationPage';


function App() {
  return (

    <BrowserRouter >
    <Toaster />
      <Routes>
        <Route path='/'>
          <Route path='home' element={<HomePage />} />
          <Route path='' element={<HomePage />} />
          <Route path='initial' element={<InitialPage />} />
          
          {/* RUTAS PARA VIAJES */}
          <Route path='login' element={<LoginComponent />}/>

          {/* RUTAS PARA VIAJES */}
          <Route path='travels' element={<Travels />} />
          <Route path='createTravel' element={<TravelCreationPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;