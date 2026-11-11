import { useEffect } from "react"
import { useDispatch } from "react-redux"
import axios from "axios";
import { toast } from "sonner";
import { setSuggestedUsers } from "@/redux/authSlice";


const useGetSuggestedUsers=()=>{
    const dispatch=useDispatch();
    useEffect(()=>{
        const fetchSuggestedUsers=async()=>{
            try {
                const res=await axios.get("https://social-media-website-instagram-clone.onrender.com/api/v1/user/suggested",{withCredentials:true});
                if(res.data.success){
                  if (!Array.isArray(res.data.users)) {
                    toast.error("Unable to load suggested users. Please try again.");
                    return;
                  }
                  dispatch(setSuggestedUsers(res.data.users));
                }
            } catch (error) {
                toast.error(
                    error.response?.data?.message ||
                    (error.request
                        ? "Unable to load suggested users. Please check your connection and try again."
                        : "Unable to load suggested users. Please try again.")
                );
            }
        }
        fetchSuggestedUsers();
    },[]);
};
export default useGetSuggestedUsers;