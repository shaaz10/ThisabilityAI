import React from 'react'
import { Outlet } from 'react-router-dom'
import NavBar from './components/NavBar'
import Footer from './components/Footer'

function RootLayout() {
  return (
    <div>
    <NavBar></NavBar>
    <div className="" style={{minHeight:"90vh"}}>
      <Outlet/>
    </div>
    <Footer/>
  </div>
  )
}

export default RootLayout