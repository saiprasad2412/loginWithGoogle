import React from 'react'
import { Routes, Route } from 'react-router-dom';
import LoginPage from './Pages/LoginPage';
import HomePage from './Pages/HomePage';
import NewPostPage from './Pages/NewPostPage';
const App = () => {
  return (
    <>
    <Routes>
      <Route path='/dashboard' element={<HomePage/>}/>
      <Route path='/login' element={<LoginPage/>}/>
      <Route path ='/new-post' element={<NewPostPage/>}/>
    </Routes>
    </>
  )
}

export default App