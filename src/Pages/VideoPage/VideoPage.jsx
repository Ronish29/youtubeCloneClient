import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Comments from "../../Components/Comments/Comments";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

import LikeWatchLaterSaveBtns from "./LikeWatchLaterSaveBtns";
import "./VideoPage.css";
import { addToHistory } from "../../actions/History";
import { viewVideo } from "../../actions/video";
import { subscribeChanel, unSubscribeChanel } from "../../actions/subscribe";

function VideoPage() {
  const { vid } = useParams();
  const vids = useSelector((state) => state.videoReducer);

  const dispatch = useDispatch();
  const vv = vids && vids.data?.filter((q) => q._id === vid)[0];
  const [selectedQuality, setSelectedQuality] = useState('1080p');
  console.log("printing vv", vv);

  console.log(vv.restrictedToView);
  const CurrentUser = useSelector((state) => state.currentUserReducer);
  const currentUserID = CurrentUser?.result._id;
  const videoChannelID = vv.videoChanel;

  const [subscribed, setSubscribed] = useState(false)
  const [subscribing, setSubscribing] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();



  const handleHistory = () => {
    dispatch(
      addToHistory({
        videoId: vid,
        Viewer: CurrentUser?.result._id,
      })
    );
  };
  const handleViews = () => {
    dispatch(viewVideo({ id: vid }));
  };

  const fetchUserDetails = async () => {
    try {
      const response = await fetch('http://localhost:4000/user/getUserDetails', {
        headers: {
          'Authorization': `Bearer ${CurrentUser.token}`
        }
      });

      const data = await response.json();
      console.log("user details", data);

      // Create an object to hold both user details and token
      const userDetailsWithToken = {
        result: { ...data.result },
        token: data.token
      };

      // Store the object in localStorage
      localStorage.setItem('Profile', JSON.stringify(userDetailsWithToken));

      const isSubscribed = data.result.subscriptions.some(subscription => subscription.chanelId === videoChannelID);
      setSubscribed(isSubscribed);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  }




  const handleSubscribe = async () => {
    if (!CurrentUser) {
      alert("Please login to subscribe");
      return;
    }
    console.log("current user id", currentUserID);
    console.log("video chanel id", videoChannelID);

    setSubscribing(true);
    dispatch(subscribeChanel({ chanelId: videoChannelID, currentUser: currentUserID }))
      .finally(() => {
        setSubscribing(false);
        fetchUserDetails();
      });
  };

  const handleUnsubscribe = async () => {
    if (!CurrentUser) {
      alert("Please login to unsubscribe");
      return;
    }

    setSubscribing(true);
    dispatch(unSubscribeChanel({ chanelId: videoChannelID, currentUser: currentUserID }))
      .finally(() => {
        setSubscribing(false);
        fetchUserDetails();
      });
  };

  const handleClose = () => {
    navigate('/');
  };

  useEffect(() => {
    if (CurrentUser) {
      handleHistory();
      fetchUserDetails();
    }
    handleViews();
  }, []);

  const handleQualityChange = (quality) => {
    setSelectedQuality(quality);
  };
  console.log("selected quality ", selectedQuality);



  return (
    <>
      {
        vv.restrictedToView && !subscribed ?
          (
            <>
              <div className='modal-background'>
                <div className="auth-modal">
                  <p>Only subscriber can view</p>
                  <div className="btn_container">
                    <button onClick={handleClose} className='sign-btn'>Close </button>
                    <button onClick={handleSubscribe} className="sub_btn">Subscribe</button>
                  </div>

                </div>

              </div>

            </>
          )
          :
          (
            <>
              <div className="container_videoPage">
                <div className="container2_videoPage">
                  <div className="video_display_screen_videoPage">
                    <video
                      src={`http://localhost:4000/${vv?.filePath}?quality=${selectedQuality}`}
                      className={"video_ShowVideo_videoPage"}
                      controls
                    // autoPlay
                    ></video>
                    <div>
                      <p>Select Quality : </p>
                      {vv.qualities.map((quality) => (
                        <button key={quality} onClick={() => handleQualityChange(quality)}>
                          {quality}
                        </button>
                      ))}
                    </div>
                    <div className="video_details_videoPage">
                      <div className="video_btns_title_VideoPage_cont">
                        <p className="video_title_VideoPage"> {vv?.videoTitle}</p>
                        <div className="views_date_btns_VideoPage">
                          <div className="views_videoPage">
                            {vv?.Views} views <div className="dot"></div>{" "}
                            {moment(vv?.createdAt).fromNow()}
                          </div>
                          <LikeWatchLaterSaveBtns vv={vv} vid={vid} />
                        </div>
                      </div>
                      <div className="chanel_main">
                        <Link
                          to={`/chanel/${vv?.videoChanel}`}
                          className="chanel_details_videoPage"
                        >
                          <b className="chanel_logo_videoPage">
                            <p>{vv?.Uploder.charAt(0).toUpperCase()}</p>
                          </b>
                          <p className="chanel_name_videoPage">{vv?.Uploder}</p>
                        </Link>
                        {subscribed ?
                          <button className="sub_btn" onClick={handleUnsubscribe}>
                            {subscribing ? 'Unsubscribing...' : 'Unsubscribe'}
                          </button>
                          :
                          <button className="sub_btn" onClick={handleSubscribe}>
                            {subscribing ? 'Subscribing...' : 'Subscribe'}
                          </button>
                        }

                      </div>

                      <div className="comments_VideoPage">
                        <h2>
                          <u>Coments</u>
                        </h2>
                        {
                          vv.restrictedComments && !subscribed ?
                            (<>
                              <p>Only subscriber can comment Please subscribe to comment </p>
                            </>) :
                            (<>
                              <Comments videoId={vv._id} />
                            </>)
                        }

                      </div>
                    </div>
                  </div>
                  <div className="moreVideoBar">
                    <div>
                      {
                        vv.timeStamp ?
                          (
                            <>
                              <h1>Time stamp</h1>
                              <table className="table-container">
                                <thead>
                                  <tr>
                                    <th>Time</th>
                                    <th>Title</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {vv?.timeStamp.map(item => (
                                    <tr key={item._id}>
                                      <td>{item.time}</td>
                                      <td>{item.title}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </>
                          ) :
                          (
                            <>
                              <p>Time stamp disabled</p>
                            </>
                          )
                      }
                    </div>
                  </div>
                </div>
              </div>
            </>
          )
      }

    </>
  );

}

export default VideoPage;
