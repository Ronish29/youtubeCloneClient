import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {  loginWithGoogle } from "../../actions/auth";
import { updateChanelDate } from "../../actions/chanelUser";
import "./CreateEditChanel.css";
import { setCurrentUser } from "../../actions/currentUser";
function CreateEditChanel({ setEditCreateChanelBtn }) {
  const CurrentUser = useSelector((state) => state.currentUserReducer);

  console.log("printing current user result", CurrentUser?.result);
  const [name, setName] = useState(CurrentUser?.result.name);
  const [desc, setDesc] = useState(CurrentUser?.result.desc);
  const dispatch = useDispatch();
  const handleSubmit = () => {
    if (!name) {
      alert("Plz Enter Name !");
    } else if (!desc) {
      alert("Plz Enter Discription !");
    } else {
      dispatch(
        updateChanelDate(CurrentUser?.result._id, {
          name: name,
          desc: desc,
        })
      );

      setEditCreateChanelBtn(false);
      const data = {
        ...CurrentUser?.result, 
        name, 
        desc
      }
      if (CurrentUser?.result.password) {
          const dataWithResult = { result: { ...data }, ...CurrentUser?.result.token }; 
          dispatch({ type: 'USER', data: dataWithResult });
          setCurrentUser(dataWithResult);
          window.location.reload();
      }
      else {
        setTimeout(() => {
          dispatch(loginWithGoogle({ email: CurrentUser?.result.email }));
        }, 2000);
      }
    }
  };
  return (
    <div className="container_CreateEditChanel">
      <input
        onClick={() => setEditCreateChanelBtn(false)}
        type="submit"
        name="text"
        value={"X"}
        className="ibtn_x"
      />
      <div className="container2_CreateEditChanel">
        <h1>
          {CurrentUser?.result.name ? <>Edit</> : <>Create </>}
          Your Chanel
        </h1>
        <input
          type="text"
          placeholder="Enter Your/Chanel Name"
          className="ibox"
          name="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          type="text"
          rows={15}
          placeholder={"Enter Chanel Description"}
          className={"ibox"}
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <input
          type="submit"
          value={"Submit"}
          onClick={handleSubmit}
          className="ibtn"
        />
      </div>
    </div>
  );
}

export default CreateEditChanel;
