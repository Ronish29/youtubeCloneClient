import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadVideo } from "../../actions/video";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "./VideoUpload.css";
function VideoUpload({ setVidUploadPage }) {
  const CurrentUser = useSelector((state) => state.currentUserReducer);
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [videoFile, setVideoFile] = useState("");
  const [restrictedToView, setRestrictedToView] = useState(false);
  const [restrictedComments, setRestrictedComments] = useState(false);
  const [loading, setLoading] = useState(false);
  console.log(CurrentUser?.result.name);

  const handleSetVideoFile = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const [progress, setProgress] = useState(0);

  const fileOptions = {
    onUploadProgress: (progressEvent) => {
      const { loaded, total } = progressEvent;
      const percentage = Math.floor(((loaded / 1000) * 100) / (total / 1000));
      setProgress(percentage);
      if (percentage === 100 && loading) {
        setTimeout(function () { }, 3000);
        setVidUploadPage(false);
      }
    },
  };
  const uploadVideoFile = () => {
    if (!title) {
      alert("Plz Enter A Title of the video");
    } else if (!videoFile) {
      alert("Plz Attach a video File");
    } else if (videoFile.size > 1000000) {
      alert("Plz Attch video file less than 1kb");
    } else {
      const fileData = new FormData();
      fileData.append("file", videoFile);
      fileData.append("title", title);
      fileData.append("chanel", CurrentUser?.result._id);
      fileData.append("Uploder", CurrentUser?.result.name);
      console.log(restrictedToView);
      console.log(restrictedComments);
      if(restrictedToView) {
        fileData.append("restrictedToView",restrictedToView);
      }else{
        fileData.append("restrictedToView",restrictedToView);
      }
      if(restrictedComments) {
        fileData.append("restrictedComments",restrictedComments);
      }else{
        fileData.append("restrictedComments",restrictedComments);
      }
      

      dispatch(
        uploadVideo({
          fileData: fileData,
          fileOptions: fileOptions,
        })
      );

      
    }
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    if (name === 'restrictedToView') {
      setRestrictedToView(checked);
    } else if (name === 'restrictedComments') {
      setRestrictedComments(checked);
    }
  };

  return (
    <div className="container_VidUpload">
      <input
        type="submit"
        name="text"
        value={"X"}
        onClick={() => setVidUploadPage(false)}
        className="ibtn_x"
      />
      <div className="container2_VidUpload">
        <div className="ibox_div_vidupload">
          <input
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            type="text"
            className="ibox_vidupload"
            maxLength={30}
            placeholder="Enter Title of your video"
          />

          <div className="category_selector">
            <input
              type="checkbox"
              name="restrictedToView"
              id="restrictViews"
              checked={restrictedToView}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="restrictViews">Subscriber can watch only</label>
          </div>

          <div className="category_selector">
            <input
              type="checkbox"
              name="restrictedComments"
              id="restrictedComments"
              checked={restrictedComments}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="restrictedComments">Subscriber can comment only</label>
          </div>


          <label htmlFor="file" className="ibox_vidupload btn_vidUpload">
            <input
              type="file"
              name="file"
              className="ibox_vidupload"
              style={{ fontSize: "1rem" }}
              onChange={(e) => {
                handleSetVideoFile(e);
              }}
            />
          </label>
        </div>
        <div className="ibox_div_vidupload">
          <input
            onClick={() => uploadVideoFile()}
            type="submit"
            value="Upload"
            className="ibox_vidupload btn_vidUpload"
          />
        </div>
        <div className="loader ibox_div_vidupload">
          <CircularProgressbar
            value={progress}
            text={`${progress}`}
            styles={buildStyles({
              rotation: 0.25,
              strokeLinecap: "butt",
              textSize: "20px",
              pathTransitionDuration: 0.5,
              pathColor: `rgba(255,255,255,${progress / 100})`,
              textColor: "#f88",
              trailColor: "#adff2f",
              backgroundColor: "#3e98c7",
            })}
          />
        </div>
      </div>
    </div>
  );
}

export default VideoUpload;
