import React, { useEffect, useState } from "react";
import { FaEdit, FaUpload } from "react-icons/fa";
import {  useDispatch, useSelector } from "react-redux";
import "./DescribeChanel.css";
import useCurrentUser from "../../actions/useCurrentUser";
import { fetchAllChanel } from "../../actions/chanelUser";
import { useNavigate } from "react-router-dom";

function DecribeChanel({ setEditCreateChanelBtn, Cid, setVidUploadPage }) {
  const [isLoading, setIsLoading] = useState(true);
  console.log(isLoading);
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(fetchAllChanel())
      .then(() => setIsLoading(false))
      .catch((error) => {
        
        console.error("Error fetching channels: ", error);
        setIsLoading(false);
      });
  }, [dispatch]);

  const chanels = useSelector((state) => state?.chanelReducers.allChannelDetails);
  console.log("printing channels: ", chanels);
  const CurrentUser = useCurrentUser();
  const currentChanel =  chanels?.find((c) => c._id === Cid);
  console.log("current chanel", currentChanel);
  const navigate = useNavigate();


  return (
    <div className="container3_chanel">
      {currentChanel ? (
        <>
          <div className="chanel_logo_chanel">
            <b>{currentChanel.name.charAt(0).toUpperCase()}</b>
          </div>
          <div className="description_chanel">
            <b> {currentChanel.name} </b>
            <p> {currentChanel.desc} </p>
          </div>
          {CurrentUser?.result._id === currentChanel._id && (
            <>
              <p
                className="editbtn_chanel"
                onClick={() => {
                  setEditCreateChanelBtn(true);
                }}
              >
                <FaEdit />
                <b> Edit Chanel</b>
              </p>
              <p className="uploadbtn_chanel" onClick={() => navigate('/creatorStudio')}>
                <FaUpload />
                <b> Upload Video</b>
              </p>
            </>
          )}
        </>
      ) : (
        <p>Please Wait </p>
      )}
    </div>
  );
}

export default DecribeChanel;
