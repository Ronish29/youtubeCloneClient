import React, { useEffect, useState } from "react";
import "./Navbar.css";
import logo from "./logo.ico";
import SearchBar from "./SearchBar/SearchBar";
import { RiVideoAddLine } from "react-icons/ri";
import { BiUserCircle } from "react-icons/bi";

import { Link } from "react-router-dom";
import { IoMdNotificationsOutline } from "react-icons/io";
import { useSelector } from "react-redux";
import Auth from "../../Pages/Auth/Auth";
import AuthModal from "../../Pages/Auth/AuthModal";
import useCurrentUser from "../../actions/useCurrentUser";
function Navbar({ toggleDrawer, setEditCreateChanelBtn }) {

  const [AuthBtn, setAuthBtn] = useState(false)
  const [authModal, setAuthModal] = useState(false);
  useCurrentUser();
  const CurrentUser = useSelector(state => state.currentUserReducer);
  

  useEffect(() => {
    console.log("Current User:", CurrentUser);
  }, [CurrentUser, useCurrentUser]);
    

  return (
    <>
      <div className="Container_Navbar">
        <div className="Burger_Logo_Navbar">
          <div className="burger" onClick={() => toggleDrawer()}>
            <p></p>
            <p></p>
            <p></p>
          </div>

          <Link to={"/"} className="logo_div_Navbar">
            <img src={logo} alt="" />
            <p className="logo_title_navbar">YouTube</p>
          </Link>
        </div>
        <SearchBar />
        <RiVideoAddLine size={22} className={"vid_bell_Navbar"} />
        <div className="apps_Box">
          <p className="appBox"></p>
          <p className="appBox"></p>
          <p className="appBox"></p>
          <p className="appBox"></p>
          <p className="appBox"></p>
          <p className="appBox"></p>
          <p className="appBox"></p>
          <p className="appBox"></p>
          <p className="appBox"></p>
        </div>
        <IoMdNotificationsOutline size={22} className="vid_bell_Navbar" />
        <div className="Auth_cont_Navbar">
          {CurrentUser ? (
            <>
              <div className="Chanel_logo_App" onClick={() => setAuthBtn(true)}>
                <p className="fstChar_logo_App">
                  {CurrentUser?.result.name ? (
                    <>{CurrentUser?.result.name.charAt(0).toUpperCase()}</>
                  ) : (
                    <>{CurrentUser?.result.email.charAt(0).toUpperCase()}</>
                  )}
                </p>
              </div>
            </>
          ) : (
            <>
              <p className="Auth_Btn" onClick={() => setAuthModal(true)}>
                <BiUserCircle size={22} />
                <b>Sign in</b>
              </p>
            </>
          )}
        </div>
      </div>
      {
        AuthBtn &&
        <Auth
          setEditCreateChanelBtn={setEditCreateChanelBtn}
          setAuthBtn={setAuthBtn}
          User={CurrentUser}
          
        />
      }
      {
        authModal &&
        <AuthModal
          authModal={authModal}
          setAuthModal={setAuthModal}
        />

      }
    </>
  );
}

export default Navbar;
