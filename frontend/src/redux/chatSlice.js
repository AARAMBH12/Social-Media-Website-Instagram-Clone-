
import { createSlice } from "@reduxjs/toolkit";

const chatSlice=createSlice({
    name:"chat",
    initialState:{
        onlineUsers:[],
        messages:[],
    },
    reducers:{
        setOnlineUsers:(state,action)=>{
            state.onlineUsers=action.payload;
        },
        setMessages:(state,action)=>{
            state.messages=action.payload;
        },
        addMessage:(state,action)=>{
            if(!state.messages.some(message=>message._id===action.payload._id)){
                state.messages.push(action.payload);
            }
        },
        replaceMessage:(state,action)=>{
            const index=state.messages.findIndex(message=>message._id===action.payload.temporaryId);
            if(index !== -1){
                state.messages[index]=action.payload.message;
            }else if(!state.messages.some(message=>message._id===action.payload.message._id)){
                state.messages.push(action.payload.message);
            }
        },
        removeMessage:(state,action)=>{
            state.messages=state.messages.filter(message=>message._id!==action.payload);
        }
    }
})
export const {setOnlineUsers,setMessages,addMessage,replaceMessage,removeMessage}=chatSlice.actions;
export default chatSlice.reducer;