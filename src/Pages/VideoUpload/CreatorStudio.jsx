import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { ChromePicker } from 'react-color';
import { useDropzone } from 'react-dropzone';
import { FiUploadCloud } from "react-icons/fi"
import "./CreatorStudio.css"
import { useDispatch, useSelector } from 'react-redux';
import { uploadVideo } from '../../actions/video';
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";

const CreatorStudio = () => {
  // State to store video file
  const [videoFile, setVideoFile] = useState(null);
  const CurrentUser = useSelector(state => state.currentUserReducer);
  const [restrictedToView, setRestrictedToView] = useState(false);
  const [restrictedComments, setRestrictedComments] = useState(false);
  const [muteChecked, setMuteChecked] = useState(false);
  const [timeStampChecked, setTimeStampChecked] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [colorTones, setColorTones] = useState(['grayscale', 'sepia', 'invert']);
  const [isMuted, setIsMuted] = useState(false);
  const [color, setColor] = useState('#ffffff');
  const [processedVideos, setProcessedVideos] = useState([]);
  const [videoDuration, setVideoDuration] = useState(0);
  const [timeStampMax, setTimeStampMax] = useState(0);
  const [tempVideos, setTempVideos] = useState([]);
  const [previewUrl, setPreviewUrl] = useState('');
  const [title, setTitle] = useState("");
  const [rows, setRows] = useState([
    { time: '00 : 00', title: 'Title 1' }
  ]);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const dispatch = useDispatch();





  const processVideo = async (colorTone) => {
    try {
      const formData = new FormData();
      formData.append('video', videoFile);
      formData.append('colorTone', colorTone);

      const response = await fetch('https://youtube-clone-2ydw.onrender.com:10000/video/tempUpload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Video processing failed');
      }

      const data = await response.json();
      console.log('Processed video with', colorTone, ':', data.processedVideo);
      return data.processedVideo;
    } catch (error) {
      console.error('Error processing video:', error.message);
      return null;
    }
  };

  const processVideoSequentially = async () => {

    const delay = 5000; // Delay between processing each color tone in milliseconds

    // Process the first color tone immediately
    const processedVideo1 = await processVideo(colorTones[0]);
    if (processedVideo1) {
      processedVideos.push(processedVideo1);
      fetchTempVideos();
    } else {
      console.error('Failed to process video with color tone:', colorTones[0]);
      return;
    }

    // Process the remaining color tones with a delay
    for (let i = 1; i < colorTones.length; i++) {
      await new Promise(resolve => setTimeout(resolve, delay)); // Wait for the delay
      const processedVideo = await processVideo(colorTones[i]);
      if (processedVideo) {
        processedVideos.push(processedVideo);

      } else {
        console.error('Failed to process video with color tone:', colorTones[i]);
        break; // Stop processing if an error occurs
      }
    }
    await new Promise(resolve => setTimeout(resolve, delay));
    setProcessing(false);
    fetchTempVideos();
    // Handle the processed videos
  };

  const handleFileUpload = (acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setVideoFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // Create preview URL for the uploaded file
      setProcessedVideos([]);
      setProcessing(true);
    }
  };

  const handleCancel = () => {
    setVideoFile(null);
    setPreviewUrl('');
    setProcessedVideos([]);
    setProcessing(false);
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'video/*',
    multiple: false,
    onDrop: handleFileUpload,
  });

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    if (name === 'restrictedToView') {
      setRestrictedToView(checked);
    } else if (name === 'restrictedComments') {
      setRestrictedComments(checked);
    }
    else if (name === "mute") {
      setMuteChecked(checked);
    }
    else if (name === "timeStamp") {
      setTimeStampChecked(checked);
    }
  };

  const addRow = () => {
    const lastTimestamp = rows.length > 0 ? parseInt(rows[rows.length - 1].time, 10) : 0;
    setRows([...rows, { time: lastTimestamp + 1, title: '' }]);
  };


  const handleRowChange = (index, field, value) => {
    let newValue = value;

    if (field === 'time') {
      // Ensure the value is a valid number
      const parsedValue = parseInt(value, 10);

      // If the parsed value is NaN or negative, set it to the previous timestamp plus one
      // If the parsed value is greater than the video duration, set it to the duration
      if (isNaN(parsedValue) || parsedValue < 0) {
        newValue = rows[index]?.time + 1 || 0;
      } else if (parsedValue > timeStampMax) {
        newValue = timeStampMax;
      }

      // Check if the new value is less than or equal to the previous timestamp
      if (parsedValue <= rows[index - 1]?.time) {
        newValue = rows[index - 1]?.time + 1;
      }
    }

    // Update the rows with the new value
    const updatedRows = [...rows];
    updatedRows[index][field] = newValue;
    setRows(updatedRows);
  };


  rows.forEach((row, index) => {
    const timeValue = formatTime(row.time); // Format the time value
    const titleValue = row.title; // Get the title value
    console.log(`Row ${index + 1}: Time - ${timeValue}, Title - ${titleValue}`);
  });

  const fetchTempVideos = async () => {
    const fetchVideos = await fetch('https://youtube-clone-2ydw.onrender.com:10000/video/tempvideos', {
    });
    const response = await fetchVideos.json();
    setTempVideos(response);
    console.log(response);
  }

  const handleVideoSelect = (selectedVideo) => {
    console.log(selectedVideo); // Check the selected video object
    setSelectedVideo(selectedVideo);
    if (selectedVideo && selectedVideo.filePath) {
      const filePathWithBaseUrl = `https://youtube-clone-2ydw.onrender.com:10000/${selectedVideo.filePath}`;
      setPreviewUrl(filePathWithBaseUrl);
      console.log('Selected video preview URL:', filePathWithBaseUrl);
      const fetchVideoBlob = async () => {
        try {
          const response = await fetch(filePathWithBaseUrl);
          if (!response.ok) {
            throw new Error('Failed to fetch video file');
          }
          const blob = await response.blob();
          
          // Create a File object from the Blob
          const file = new File([blob], selectedVideo.fileName, { type: blob.type });
          setVideoFile(file);
          console.log('Video File:', file);
          // Now you can use this file to upload the video
        } catch (error) {
          console.error('Error fetching video file:', error.message);
        }
      };
      fetchVideoBlob();
    } else {
      console.error('Invalid selected video:', selectedVideo);
    }
  };

  const fileOptions = {
    onUploadProgress: (progressEvent) => {
      const { loaded, total } = progressEvent;
      const percentage = Math.floor(((loaded / 1000) * 100) / (total / 1000));
      setProgress(percentage);
      if (percentage === 100 && loading) {
        setTimeout(function () { }, 3000);
      }
    },
  };

  const uploadVideoFile = async () => {
    if (!title) {
      alert("Please enter a title for the video");
      return;
    }
  
    if (selectedVideo !== null) {
      console.log("Code is running for temporary file upload");
      console.log(videoFile)
      const fileData = new FormData();
      fileData.append("file", videoFile); 
      fileData.append("title", title);
      fileData.append("chanel", CurrentUser?.result._id);
      fileData.append("Uploder", CurrentUser?.result.name);
      if (restrictedToView) {
        fileData.append("restrictedToView", restrictedToView);
      }
      if (restrictedComments) {
        fileData.append("restrictedComments", restrictedComments);
      }
      // Append timestamp data if needed
      if (timeStampChecked) {
        rows.forEach(row => {
          const formattedTime = formatTime(row.time);
          fileData.append("timestamps[]", formattedTime);
          fileData.append("titles[]", row.title);
        });
      }
      dispatch(
        uploadVideo({
          fileData: fileData,
          fileOptions: fileOptions,
        })
      );
    } else {
      console.log("Code is running for original file upload");
      if (!videoFile) {
        alert("Please select a video to upload");
        return;
      }
      const fileData = new FormData();
      fileData.append("file", videoFile);
      console.log(videoFile);
      fileData.append("title", title);
      fileData.append("chanel", CurrentUser?.result._id);
      fileData.append("Uploder", CurrentUser?.result.name);
      if (restrictedToView) {
        fileData.append("restrictedToView", restrictedToView);
      }
      if (restrictedComments) {
        fileData.append("restrictedComments", restrictedComments);
      }
      // Append timestamp data if needed
      if (timeStampChecked) {
        
        rows.forEach(row => {
          const formattedTime = formatTime(row.time);
          fileData.append("timestamps[]", formattedTime);
          fileData.append("titles[]", row.title);
        });
      }
      console.log(fileData);
      dispatch(
        uploadVideo({
          fileData: fileData,
          fileOptions: fileOptions,
        })
      );
    }
  };
  
  

  useEffect(() => {
    if (videoFile) {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        setProcessing(false);
        setVideoDuration(Math.floor(video.duration));
        setTimeStampMax(Math.floor(video.duration));
      };
      video.src = URL.createObjectURL(videoFile);
      return () => {
        URL.revokeObjectURL(video.src);
      };
    }
  }, [videoFile]);


  return (
    <div className="studio_container">
      <div className='video_details'>
        <h1 className='userName_text'>Welcome {CurrentUser?.result.name} </h1>
        {/* Video Player */}
        {videoFile && (
          <div className='uploader_container'>
            <h3>Preview</h3>
            <ReactPlayer
              url={previewUrl}
              muted={muteChecked} // Adjust as needed
              controls
            />
            <button onClick={handleCancel} className='cancel_btn'>Cancel</button>
          </div>
        )}

        {/* Dropzone */}
        {!videoFile && (
          <div className='uploader_container'>
            <div {...getRootProps()} className='dropzone_file'>
              <input {...getInputProps()} />
              <FiUploadCloud className='upload-icon' />
              <p>Drag 'n' drop  video files here, or click to select files</p>
            </div>
          </div>
        )}
        {
          videoFile && (
            <button onClick={processVideoSequentially} className='process_btn'>Process the video</button>
          )
        }

        {processing && <p>Processing...</p>}

        {tempVideos.length > 0 && (
          <div className='processed_videos'>
            <h3>Choose color tone</h3>
            <div className='color-tone-videos'>
              {tempVideos.map((video, index) => (
                <div key={index} className="video-container">
                  <input
                    type="radio"
                    id={`video_${index}`}
                    value={index}
                    checked={selectedVideo === video}
                    onChange={() => handleVideoSelect(video)}
                  />
                  <label htmlFor={`video_${index}`}>
                    {video.filePath && (
                      <video src={`https://youtube-clone-2ydw.onrender.com:10000/${video?.filePath}`} controls width="400px" height="auto" />
                    )}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className='categories'>
          <div className='options_selector'>

            <div className="category_selector">
              <input
                type="checkbox"
                name="mute"
                id="mute"
                checked={muteChecked}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="">Mute</label>
            </div>

            <div className="category_selector">
              <input
                type="checkbox"
                name="timeStamp"
                id="timeStamp"
                checked={timeStampChecked}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="">Enable time stamp</label>
            </div>

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

          </div>
        </div>
      </div>

      <div className='time_stamp'>
        {timeStampChecked && (
          <div className='table-container'>
            <table>
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Title</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="number"
                        min={0}
                        max={timeStampMax}
                        value={row.time}
                        onChange={(e) => handleRowChange(index, 'time', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={row.title}
                        onChange={(e) => handleRowChange(index, 'title', e.target.value)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className='add-row-button' onClick={addRow} disabled={rows[rows.length - 1].time >= timeStampMax}>
              Add Another time stamp
            </button>
          </div>
        )}

        <input
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          type="text"
          className="ibox_vidupload"
          maxLength={30}
          placeholder="Enter Title of your video"
        />

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
};

export default CreatorStudio;

// Function to format time in mm:ss format
const formatTime = (timeInSeconds) => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedSeconds = seconds.toString().padStart(2, '0');
  return `${formattedMinutes}:${formattedSeconds}`;
};
