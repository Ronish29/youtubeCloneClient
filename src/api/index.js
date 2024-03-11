import axios from "axios";

const API = axios.create({ baseURL: `https://youtube-clone-2ydw.onrender.com:10000/` });
// const API = axios.create({ baseURL: `https://youtubeclone5031.herokuapp.com/` });

const getUserFromLocalStorage = () => {
  return localStorage.getItem("User") ? JSON.parse(localStorage.getItem("User")) : null;
};

// Add a function to retrieve profile information from localStorage
const getProfileFromLocalStorage = () => {
  return localStorage.getItem("Profile") ? JSON.parse(localStorage.getItem("Profile")) : null;
};

API.interceptors.request.use((req) => {
  const profile = getProfileFromLocalStorage();
  const user = getUserFromLocalStorage();
  
  // Check if either profile or user is present
  if (profile) {
    req.headers.authorization = `Bearer ${profile.token}`;
  } else if (user) {
    req.headers.authorization = `Bearer ${user.token}`;
  }
  
  return req;
});

export const loginWithGoogle = (authData) => API.post("/user/loginWithGoogle", authData);
export const login = (loginData) => API.post("/user/login",loginData);
export const signup = (signUpData) => API.post("user/signup",signUpData);
export const updateChanelData = (id, updateData) =>
  API.patch(`/user/update/${id}`, updateData);
export const fetchAllChanel = () => API.get("/user/getAllChanels");

export const uploadVideo = (fileData, fileOptions) =>
  API.post("/video/uploadVideo", fileData, fileOptions);
export const getVideos = () => API.get("/video/getvideos");
export const likeVideo = (id, Like) => API.patch(`/video/like/${id}`, { Like });
export const viewsVideo = (id) => API.patch(`/video/view/${id}`);

export const addToLikedVideo = (likedVideoData) =>
  API.post("/video/likeVideo", likedVideoData);
export const getAlllikedVideo = () => API.get("/video/getAlllikeVideo");
export const deletelikedVideo = (videoId, Viewer) =>
  API.delete(`/video/deleteLikedVideo/${videoId}/${Viewer}`);

export const addTowatchLater = (watchLaterData) =>
  API.post("/video/watchLater", watchLaterData);
export const getAllwatchLater = () => API.get("/video/getAllwatchLater");
export const deleteWatchLater = (videoId, Viewer) =>
  API.delete(`/video/deleteWatchlater/${videoId}/${Viewer}`);

export const addToHistory = (HistoryData) =>
  API.post("/video/History", HistoryData);
export const getAllHistory = () => API.get("/video/getAllHistory");
export const deleteHistory = (userId) =>
  API.delete(`/video/deleteHistory/${userId}`);

export const subscribeChanel = (subscribeData) => API.patch(`chanel/subscribe/${subscribeData.chanelId}`, { userId: subscribeData.currentUser });;
export const unSubscribeChanel =(unSubscribeData) => API.patch(`chanel/unsubscribe/${unSubscribeData.chanelId}`,{ userId: unSubscribeData.currentUser })

export const postComment=(CommentData)=>API.post('/comment/post',CommentData)
export const deleteComment=(id)=>API.delete(`/comment/delete/${id}`)
export const editComment=(id,commentBody)=>API.patch(`/comment/edit/${id}`,{commentBody})
export const getAllComment=()=>API.get('/comment/get')