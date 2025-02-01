import React from "react";

import { NavLink, useNavigate } from "react-router-dom";

function SignIn() {

  let navigate = useNavigate();
 



  return (
    <div className=" container ">
      <div className="row justify-content-center pt-5">
        <div className="col-lg-4 col-md-6 col-sm-6">
          <div className="card shadow-sm border-1 rounded-3  " style={{ height: "65vh" }}>
            <h2 className="text-center m-2 p-2">Signin</h2>
            <div className="card-body">
              <form>

                <div className="signin-input-container d-flex">
                  
                  <input
                    type="text"
                    id="username"
                    className="form-control  mt-2"
                    placeholder="Username"
                    
                  />
                </div>
                
                <div className="input-container mt-4">
               
                  <input
                    type="password"
                    id="password"
                    className="form-control "
                    placeholder="Password"
                    
                  />
                   
                  <div className="forgot_password float-end text-primary fw-normal ">
                    <a href="" className="text-decoration-none mb-5 text-secondary">
                      forgot password?
                    </a>
                  </div>
                </div>
                <div>

                <button
                  type="submit"
                  className="btn btn-dark mx-auto d-block mt-5 w-100 text-white" 
                >
                  Signin
                </button>
   
                </div>
                <p className="text-center mt-3 lead">
                  Dont have an account?
                  <NavLink
                    className="fw-bold text-decoration-none text-dark "
                    to="/signup"
                  >
                    SignUp
                  </NavLink>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
