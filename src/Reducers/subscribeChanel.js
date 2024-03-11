const subscribeChanelReducer = (state = { data: [] }, action) => {
    switch (action.type) {
        case 'SUBSCRIBE_CHANNEL_SUCCESS':
            return { ...state, subscribed: true };
        case 'SUBSCRIBE_CHANNEL_FAILURE':
            return { ...state, subscribed: false };
        case 'UNSUBSCRIBE_CHANNEL_SUCCESS':
            return { ...state, unsubscribe: true} ;
        case 'UNSUBSCRIBE_CHANNEL_FAILURE':
            return { ...state, unsubscribe: false};
        default:
            return state;
    }
};
export default subscribeChanelReducer;