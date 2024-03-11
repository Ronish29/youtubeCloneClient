import * as api from "../api";
import { setCurrentUser } from "./currentUser";

export const loginWithGoogle = (authData) => async (dispatch) => {
  try {
    const { data } = await api.loginWithGoogle(authData);
    // Dispatch the AUTH action to update authentication data
    dispatch({ type: "AUTH", data }); 
    dispatch(setCurrentUser(data));

  } catch (error) {
    alert(error);
  }
};

export const login = (loginData) => async (dispatch) => {
  try {
    const { data } = await api.login(loginData);
    dispatch({ type: 'USER', data });
    dispatch(setCurrentUser(data));
    return { success: true, message: 'Login successful' };
  } catch (error) {
    const response = error.response.data;
    const failedAttempts = response.failedAttempts; 
    return { success: false, message: response.message || 'Login failed', failedAttempts }; 
  }
};

