import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import LeftSidebar from "../../Components/LeftSidebar/LeftSidebar";
import ShowVideoGrid from "../../Components/ShowVideoGrid/ShowVideoGrid";
import io from "socket.io-client";

// import vid from "../../Components/Video/vid.mp4";
import "./Home.css";
import { getAllVideo } from "../../actions/video";
import toast from "react-hot-toast";
function Home() {

  const vids=useSelector(state=>state.videoReducer)?.data?.filter(q=>q).reverse();
  const dispatch = useDispatch();

    
  const NavList = [
    "All",
    "Python",
    "Java",
    "C++",
    "Movies",
    "Science",
    "Animation",
    "Gaming",
    "Comedy",
  ];
  const socket = io('http://localhost:4000');


  
  useEffect(() => {
    socket.on('videoUploaded', (data) => {
        console.log("printing socket data",data);
        setTimeout(() => {
          toast.success(`${data.uploder} uploaded ${data.title}`)
        }, 2000);
        dispatch(getAllVideo());
    });

    return () => {
        socket.disconnect();
    };
  }, [socket]);
  return (
    <div className="container_Pages_App">
      <LeftSidebar />
      <div className="container2_Pages_App">
        <div className="navigation_Home">
          {NavList.map((m) => {
            return (
              <p key={m} className="btn_nav_home">
                {m}
              </p>
            );
          })}
        </div>
        <ShowVideoGrid vids={vids} />
      </div>
    </div>
  );
}

export default Home;