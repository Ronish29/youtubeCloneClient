const initialState = {
  data: JSON.parse(localStorage.getItem("Profile")) || JSON.parse(localStorage.getItem("User")) || null
}; 

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'AUTH':
      localStorage.setItem("Profile", JSON.stringify({ ...action?.data }));
      return { ...state, data: action?.data };
    case 'USER':
      localStorage.setItem("User", JSON.stringify({ ...action?.data }));
      return { ...state, data: action?.data };
    default:
      return state;
  }
};

export default authReducer;
