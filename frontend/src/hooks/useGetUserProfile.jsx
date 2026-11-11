import { useEffect } from "react"
import { useDispatch } from "react-redux"
import axios from "axios";
import { toast } from "sonner";
import {  setUserProfile } from "@/redux/authSlice";


const useGetUserProfile=(userId)=>{
    const dispatch=useDispatch();
    // const [userProfile,setUserProfile]=useState(null);

    useEffect(()=>{
        const fetchUserProfile=async()=>{
            try {
                const res=await axios.get(`http://localhost:8000/api/v1/user/${userId}/profile`,{withCredentials:true});
                if(res.data.success){
                  dispatch(setUserProfile(res.data.user));
                }
            } catch (error) {
                toast.error(
                    error.response?.data?.message ||
                    (error.request
                        ? "Unable to load posts. Please check your connection and try again."
                        : "Unable to load posts. Please try again.")
                );
            }
        }
        fetchUserProfile();
    },[userId]);
};
export default useGetUserProfile;