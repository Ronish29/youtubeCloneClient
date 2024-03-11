import * as api from "../api";

export const subscribeChanel = (subscribeData) => async (dispatch) => {
  try {
    const { data } = await api.subscribeChanel(subscribeData);
    dispatch({ type: "SUBSCRIBE_CHANNEL_SUCCESS", data });
  } catch (error) {
    console.log(error);
    dispatch({ type: "SUBSCRIBE_CHANNEL_FAILURE", error: error.message });
  }
};

export const unSubscribeChanel = (unSubscribeData) => async (dispatch) => {
  try {
    const { data } = await api.subscribeChanel(unSubscribeData);
    dispatch({ type: "UNSUBSCRIBE_CHANNEL_SUCCESS", data });
  } catch (error) {
    console.log(error);
    dispatch({ type: "UNSUBSCRIBE_CHANNEL_FAILURE", error: error.message });
  }
}