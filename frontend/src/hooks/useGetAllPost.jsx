import { useEffect } from "react"
import { useDispatch } from "react-redux"
import axios from "axios";
import { toast } from "sonner";
import { setPosts } from "@/redux/postSlice";


const useGetAllPost=()=>{
    const dispatch=useDispatch();
    useEffect(()=>{
        const fetchAllPost=async()=>{
            try {
                const res=await axios.get("http://localhost:8000/api/v1/post/all",{withCredentials:true});
                if(res.data.success){
                  dispatch(setPosts(res.data.posts));
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
        fetchAllPost();
    },[]);
};
export default useGetAllPost;