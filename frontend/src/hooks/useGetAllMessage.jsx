import { useEffect } from "react"
import { useDispatch } from "react-redux"
import axios from "axios";
import { toast } from "sonner";
import { setMessages } from "@/redux/chatSlice";
import { useSelector } from "react-redux";


const useGetAllMessage=()=>{
    const dispatch=useDispatch();
    const {selectedUser}=useSelector(store=>store.auth);
    useEffect(()=>{
        if(!selectedUser?._id){
            dispatch(setMessages([]));
            return;
        }

        let isCurrentConversation = true;
        const fetchAllMessage=async()=>{
            try {
                const res=await axios.get(`http://localhost:8000/api/v1/message/all/${selectedUser?._id}`,{withCredentials:true});
                if(res.data.success && isCurrentConversation){
                  dispatch(setMessages(res.data.messages));
                }
            } catch (error) {
                if(isCurrentConversation){
                    toast.error(
                        error.response?.data?.message ||
                        (error.request
                            ? "Unable to load messages. Please check your connection and try again."
                            : "Unable to load messages. Please try again.")
                    );
                }
            }
        }
        fetchAllMessage();
        return ()=> {
            isCurrentConversation = false;
        };
    },[selectedUser?._id, dispatch]);
};
export default useGetAllMessage;