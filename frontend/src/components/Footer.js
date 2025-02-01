import React from 'react'
import './Footer.css'

function Footer() {
  return (
    <footer className='section bg-dark text-white text-decoration-none text-white'>
      <div className="container mb-4">
        <div className="row d-flex justify-content-around text-decoration-none" >
          <div className="col-lg-3 col-sm-2 " >
            <h5 className='text-uppercase  mt-4'>information</h5>
            <ul className="list-unstyled mt-4 ">
              <li><a href="" className=' text-decoration-none text-white'>Pages</a></li>
              <li><a href="" className=' text-decoration-none text-white'>Team</a></li>
              <li><a href="" className=' text-decoration-none text-white'>Feuchers</a></li>
              <li><a href="" className=' text-decoration-none text-white'>Pricing</a></li>
            </ul>
          </div>
          <div className="col-lg-3 col-sm-2">
            <h5 className='text-uppercase  mt-4'>Services</h5>
            <ul className="list-unstyled mt-4">
              <li><a href="" className=' text-decoration-none text-white'>Branding</a></li>
              <li><a href="" className=' text-decoration-none text-white'>Design</a></li>
              <li><a href="" className=' text-decoration-none text-white'>Marketing</a></li>
              <li><a href="" className=' text-decoration-none text-white'>Advertisement</a></li>
            </ul>
          </div>
          <div className="col-lg-3 col-sm-2 ">
            <h5 className='text-uppercase  mt-4'>Contact</h5>
            <ul className="list-unstyled mt-4 ">
              <li><a href="" className=' text-decoration-none text-white'>India,Telangana</a></li>
              <li><a href="" className=' text-decoration-none text-white'>thisability@gmail.com</a></li>
              <li><a href="" className=' text-decoration-none text-white'>+91 1234467845</a></li>
              <li><a href="" className=' text-decoration-none text-white'></a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className='copyright justify-content-around text-center align-items-center  mt-3  border-top border-secondary d-flex'>
          <p>Copyright 2024-All copyrights reserved</p>
          <div className='social_media'>
            <ul className=' list-unstyled d-flex '>
              <li><a href=""></a></li>
              <li><a href=""></a></li>
              <li><a href=""></a></li>
              <li><a href=""></a>
</li>
            </ul>

          </div>
        </div>
        

    </footer>
  )
}

export default Footer