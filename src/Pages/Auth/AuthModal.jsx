// AuthModal.js

import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux'; // Assuming you're using Redux
import "./AuthModal.css"
import { gapi } from "gapi-script";

import { FaGoogle } from "react-icons/fa";
import GoogleLogin from 'react-google-login';
import { loginWithGoogle } from '../../actions/auth';
import { login } from '../../actions/auth';
import toast from 'react-hot-toast';
import axios from 'axios';

const AuthModal = ({ setAuthModal }) => {
  const [loginEmail, setloginEmail] = useState('');
  const [loginPassword, setloginPassword] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [confirmPassword, setconfirmPassword] = useState('');


  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId:
          "281238746180-nu6ucd9e855r7g3ks31q7qjf8cmsk2o6.apps.googleusercontent.com",
        scope: "email",
      });
    }
    gapi.load("client:auth2", start);
  }, []);
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    const loginData = {
      email: loginEmail,
      password: loginPassword
    };

    try {
      const response = await dispatch(login(loginData));
      console.log("printing response", response);

      if (response.success) {
        toast.success("Login Successful");
        setAuthModal(false);
      } else {
        if(response.failedAttempts){
          toast.error(`${response.message}. Failed Attempts: ${response.failedAttempts}`);
        }else{
          toast.error(response.message);
        }
      }
    } catch (error) {
      // Handle login failure
      console.log("Login failed:", error);
      toast.error('Login failed');
    }
  };




  const handleSignUp = (e) => {
    e.preventDefault();


    axios.post('https://youtube-clone-2ydw.onrender.com:10000/user/signup', {
      signUpemail : signUpEmail,
      signUppassword : signUpPassword,
      cnfPassword : confirmPassword,
    })
    .then(function (response) {
      console.log(response);
      toast.success("User registered successfully");
    })
    .catch(function (error) {
      console.log(error);
      toast.error("Unable to register");
    });

  }

  const onSuccess = (response) => {
    const Email = response?.profileObj.email;
    dispatch(loginWithGoogle({ email: Email }));
    setAuthModal(false);
  };

  const onFailure = (response) => {
    console.log("Failed", response);
  };

  const handleClose = () => {
    setAuthModal(false);
  }

  return (
    <div className='modal-background'>

      <div className="auth-modal">
        <h2>Sign In</h2>
        <form onSubmit={handleLogin} >
          <input
            type="email"
            placeholder="Email"
            value={loginEmail}
            onChange={(e) => setloginEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={loginPassword}
            onChange={(e) => setloginPassword(e.target.value)}
            required
          />
          <div className='btns-div'>
            <button type='submit' className='sign-btn'>Sign In</button>
          </div>
        </form>

        <div className='or-container'>
          <hr />
          <span className='or-span'>Or</span>
          <hr />
        </div>


        <GoogleLogin
          clientId={
            "281238746180-nu6ucd9e855r7g3ks31q7qjf8cmsk2o6.apps.googleusercontent.com"
          }
          onSuccess={onSuccess}
          onFailure={onFailure}
          render={(renderProps) => (
            <div className='google-btn' onClick={renderProps.onClick}>
              <FaGoogle />
              <span>
                Sign In with Google
              </span>
            </div>
          )}
        />




        <div className='or-container'>
          <hr />
          <span className='or-span'>Or</span>
          <hr />
        </div>

        <div className='signup-form'>
          <form onSubmit={handleSignUp}>
            <input
              type="email"
              placeholder="Email"
              value={signUpEmail}
              onChange={(e) => setSignUpEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={signUpPassword}
              onChange={(e) => setSignUpPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setconfirmPassword(e.target.value)}
            />
            <div className='btns-div'>
              <button type='submit' className='sign-btn'>Sign Up</button>
            </div>
          </form>

        </div>

        <button onClick={handleClose} className='sign-btn'>Close </button>
      </div>
    </div>
  );
};

export default AuthModal;
