import * as api from "../api";



export const fetchAllChanel=()=>async(dispatch)=>{
    try {
        const {data}= await api.fetchAllChanel();
        dispatch({type:'FETCH_CHANELS',payload:data})
    } catch (error) {
        console.log(error)
    }
}
export const updateChanelDate=(id,updateData)=> async(dispatch)=>{
    try {
        console.log("updated chanel data",id,updateData)
        const {data}= await api.updateChanelData(id,updateData);
        dispatch({type:'UPDATE_DATA', payload: data.updateData })
    } catch (error) {
        console.log(error)
    }
}