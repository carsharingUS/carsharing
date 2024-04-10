import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import HomePage from './pages/HomePage';
import LoginComponent from './pages/login/LoginComponent'
import './App.css'
import InitialPage from './pages/InitialPage'
import Travels from './pages/travels/Travels';
import UserProfile from './pages/UserProfile';
import TravelCreationPage from './pages/travels/TravelCreationPage';
import MessagePage from './pages/MessagePage';
import MyTravels from './pages/travels/MyTravels';
import TravelDetails from './pages/travels/TravelDetails';
import MapView from './components/map/MapView';

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
          <Route path='travels/:travelId' element={<TravelDetails />} />
          <Route path='my_travels' element={<MyTravels />} />
          <Route path='createTravel' element={<TravelCreationPage />} />
          <Route path='map' element={<MapView />} />

          {/* RUTAS PARA USUARIO */}
          <Route path='updateUser' element={<UserProfile />} />

          {/* RUTA PARA CHAT */}

          <Route path='chat' element={<MessagePage/>} />


        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;