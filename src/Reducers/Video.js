const initialState = JSON.parse(localStorage.getItem('videoState')) || { data: [], loading: false };

const videoReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'POST_VIDEO':
      return { ...state };
    case 'POST_LIKE':
      return { ...state };
    case 'FETCH_ALL_VIDEOS_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_ALL_VIDEOS_SUCCESS':
      const newState = { ...state, data: action.payload, loading: false };
      localStorage.setItem('videoState', JSON.stringify(newState));
      return newState;
    case 'FETCH_ALL_VIDEOS_FAILURE':
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default videoReducer;
