import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserPage } from "./pages/userPage";
import { UserFormPage } from "./pages/userForm";
import { Navigation } from './components/Navigation';
import { Toaster } from 'react-hot-toast';


function App() {
  return (
    <BrowserRouter>
    <div className='container mx-auto'>
    <Navigation />
      <Routes>
        <Route path="/" element={<Navigate to="/user" />}></Route>
        <Route path="/user" element={<UserPage />}></Route>
        <Route path="/user-create" element={<UserFormPage />}></Route>
        <Route path="/user/:id" element={<UserFormPage />}></Route>
        
      </Routes>
      <Toaster />
    </div>
    </BrowserRouter>
  );
}

export default App;