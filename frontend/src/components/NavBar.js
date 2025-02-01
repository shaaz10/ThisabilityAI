import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.jpg'

const NavBar = () => {
  let navigate = useNavigate();

  return (
    <nav className="navbar navbar-expand-lg text-white bg-dark">
      <div className="container-fluid text-white">
        {/* Title on the left */}
        <div className=' '>
        <img src={logo} className='rounded-circle me-2' style={{width:"45px"}} alt="" />
        </div>
        <a className="navbar-brand text-white fw-medium" onClick={() => navigate('/home')}>
          Thisability<span className='fw-semibold text-danger fs-4'>AI</span>
        </a>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible items */}
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav text-white">
            {/* Sign In and Sign Up buttons on the right */}
            <li className="nav-item">
              <button className="btn nav-link text-white fs-5" onClick={() => navigate('/signin')}>
                Sign In
              </button>
            </li>
            <li className="nav-item">
              <button className="btn nav-link text-white fs-5" onClick={() => navigate('/signup')}>
                Sign Up
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
