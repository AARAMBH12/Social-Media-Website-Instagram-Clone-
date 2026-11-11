import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addMessage } from "@/redux/chatSlice";
import { clearMessageNotificationsForSender } from "@/redux/rtnSlice";


const useGetRTM=(selectedUser)=>{
    const dispatch=useDispatch();
    const {socket}=useSelector(store=>store.socketio);
    const {user}=useSelector(store=>store.auth);
   
    useEffect(()=>{
        if(!socket || !user?._id || !selectedUser?._id) return;

        const handleNewMessage=(message)=>{
            if(
                String(message.senderId)===String(selectedUser._id) &&
                String(message.receiverId)===String(user._id)
            ){
                dispatch(addMessage(message));
                dispatch(clearMessageNotificationsForSender(message.senderId));
            }
        };

        socket.on('newMessage',handleNewMessage);
        return ()=>{
            socket.off('newMessage',handleNewMessage);
        }
    },[socket,user?._id,selectedUser?._id,dispatch]);
};
export default useGetRTM;