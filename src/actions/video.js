import * as api from "../api";

export const uploadVideo = (videoData) => async (dispatch) => {
  console.log(videoData);
  try {
    const { fileData, fileOptions } = videoData;
    console.log(fileData);
    console.log(fileOptions);
    // const eventSource = new EventSource('http://localhost:4000/video/uploadVideo');
    // eventSource.onmessage = (event) => {
    //   const progress = parseFloat(event.data);
    //   console.log('Progress:', progress);
    // };
    await api.uploadVideo(fileData, fileOptions);
    // eventSource.close();
    dispatch(getAllVideo());
  } catch (error) {
    console.log(error);
  
  }
};

export const getAllVideo = () => async (dispatch) => {
  try {
    dispatch({ type: 'FETCH_ALL_VIDEOS_REQUEST' });
    const { data } = await api.getVideos();
    dispatch({ type: 'FETCH_ALL_VIDEOS_SUCCESS', payload: data });
  } catch (error) {
    dispatch({ type: 'FETCH_ALL_VIDEOS_FAILURE' });
    console.log(error);
  }
};


export const likeVideo = (LikeDate) => async (dispatch) => {
  try {
    const { id, Like } = LikeDate;
    const { data } = await api.likeVideo(id, Like);
    dispatch({ type: "POST_LIKE", payload: data })
    dispatch(getAllVideo());
  } catch (error) {
    console.log(error)
  }
}

export const viewVideo = (ViewDate) => async (dispatch) => {
  try {
    const { id } = ViewDate;
    console.log(id)
    const { data } = await api.viewsVideo(id)
    dispatch({ type: 'POST_VIEWS', data })
    dispatch(getAllVideo())
  } catch (error) {
    console.log(error)
  }
}
