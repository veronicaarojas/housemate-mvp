import { useEffect, useState } from 'react'
import './App.css'
import { Router, Routes, Route, Link } from "react-router-dom";
import AdminView from "./pages/AdminView";
import FeedView from './pages/FeedView';
import ProfileView from './pages/ProfileView';



function App() {
 
  

  
  

  return (
    
      <div>
       <h1 className='mx-3'>HouseMate <i className="fa-solid fa-house-user"></i></h1>
       <div className="container">
        <div className="row">
       <nav>
        <ul className='list-inline'>
          <li className='list-inline-item'>
            <Link to="/">Home</Link>
          </li>
          <li className='list-inline-item'>
            <Link to="/admin">Create Profile</Link>
          </li>
        </ul>
        </nav>
        </div>
       </div>
       
       <Routes>
        <Route path='/' element={<FeedView />} />
          <Route path='/:roomieId' element={<ProfileView />}/>
        <Route path='/admin' element={<AdminView />} />
       </Routes>
       

       
        
      </div>
    
      
  
  );
}

export default App
