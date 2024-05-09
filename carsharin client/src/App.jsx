import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import HomePage from './pages/HomePage';
import LoginComponent from './pages/login/LoginComponent'
import './App.css'
import InitialPage from './pages/InitialPage'
import Travels from './pages/travels/Travels';
import UserProfile from './pages/UserProfile';
import TravelCreationPage from './pages/travels/TravelCreationPage';
import MyTravels from './pages/travels/MyTravels';
import TravelDetails from './pages/travels/TravelDetails';
import Chat from './components/chat/Chat';

function App() {
  return (

    <BrowserRouter >
    <Toaster />
      <Routes>
        <Route path='/'>
          <Route path='home' element={<HomePage />} />
          <Route path='' element={<HomePage />} />
          <Route path='initial' element={<InitialPage />} />
          <Route path='chat' element={<Chat />} />
          <Route path='travels/:travelId/chat/room/:otherUserId' element={<Chat />} />
          
          {/* RUTAS PARA VIAJES */}
          <Route path='login' element={<LoginComponent />}/>

          {/* RUTAS PARA VIAJES */}
          <Route path='travels' element={<Travels />} />
          <Route path='travels/:travelId' element={<TravelDetails />} />
          <Route path='my_travels' element={<MyTravels />} />

          {/* RUTAS PARA USUARIO */}
          <Route path='updateUser' element={<UserProfile />} />
          <Route path='createTravel' element={<TravelCreationPage />} />


        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;