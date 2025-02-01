import React from 'react'
import {NavLink, useNavigate} from 'react-router-dom'
import { useState } from 'react'

function SignUp() {
  let navigate=useNavigate()

  return (
    <div className='container'>
      <div className="row justify-content-center mt-5">
        <div className="col-lg-4 col-md-6 col-sm-6">
          <div className="card shadow-sm border-1 rounded-3 " style={{height:'65vh'}}>
            <h2 className='text-center p-3'>Signup</h2>
            <div className="card-body">
              {/* display the error messa`ge for signup */}

              <form >
                <div className='input-container d-flex'>
                
                <input type="text" name="username" id="username" className="form-control " placeholder='Username' />
                </div>

                <div className='input-container d-flex mt-3'>
              
                  <input type="email" name="email" id="email" className="form-control" placeholder='Email'/>
                </div>
                
                <div className='input-container d-flex mt-3'>
               
                  <input type="password" name="password" id="password" className="form-control" placeholder='Password' />
                </div>
                
                <button type="submit"  className='btn btn-dark  mx-auto d-block mt-3 mb-2 w-100 text-white' >SignUp</button>
                <p className='text-center'>Already have an account? <NavLink className="fw-bold text-decoration-none text-dark" to="/signin">SignIn</NavLink></p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp