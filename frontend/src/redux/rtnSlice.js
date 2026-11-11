import { createSlice } from "@reduxjs/toolkit";
const rtnSlice=createSlice({
    name:"realTimeNotification",
    initialState:{
        likeNotification:[],
        messageNotification:[],

    },
    reducers:{
        setLikeNotification:(state,action)=>{
            if(action.payload.type==='like'){
                state.likeNotification.push(action.payload);

            }else if(action.payload.type==='dislike'){
                state.likeNotification=state.likeNotification.filter((item)=>item.userId!==action.payload.userId);
            }
        },
        clearLikeNotifications:(state)=>{
            state.likeNotification=[];
        },
        expireLikeNotification:(state,action)=>{
            state.likeNotification=state.likeNotification.filter(
                notification=>notification.notificationId!==action.payload
            );
        },
        addMessageNotification:(state,action)=>{
            if(!state.messageNotification.some(message=>message._id===action.payload._id)){
                state.messageNotification.push(action.payload);
            }
        },
        expireMessageNotification:(state,action)=>{
            state.messageNotification=state.messageNotification.filter(
                message=>message._id!==action.payload
            );
        },
        clearMessageNotificationsForSender:(state,action)=>{
            state.messageNotification=state.messageNotification.filter(
                message=>String(message.senderId)!==String(action.payload)
            );
        },
        clearMessageNotifications:(state)=>{
            state.messageNotification=[];
        }
    }
});
export const {
    setLikeNotification,
    clearLikeNotifications,
    expireLikeNotification,
    addMessageNotification,
    expireMessageNotification,
    clearMessageNotificationsForSender,
    clearMessageNotifications
}=rtnSlice.actions;
export default rtnSlice.reducer;