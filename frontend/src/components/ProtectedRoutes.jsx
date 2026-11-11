import { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { toast } from 'sonner';
import { setAuthUser } from '../redux/authSlice';


const ProtectedRoutes = ({children}) => {
    const {user}=useSelector(store=>store.auth);
    const dispatch=useDispatch();
    const [isCheckingAuth,setIsCheckingAuth]=useState(true);

    useEffect(()=>{
        let isActive=true;
        const verifySession=async()=>{
            try {
                const res=await axios.get(
                    'https://social-media-website-instagram-clone.onrender.com/api/v1/user/me',
                    {withCredentials:true}
                );
                if(isActive){
                    dispatch(setAuthUser(res.data.user));
                }
            } catch (error) {
                if(!isActive) return;
                dispatch(setAuthUser(null));
                if(error.response?.status!==401){
                    toast.error(
                        error.response?.data?.message ||
                        'Unable to verify your session. Please try again.'
                    );
                }
            } finally {
                if(isActive){
                    setIsCheckingAuth(false);
                }
            }
        };
        verifySession();
        return ()=>{isActive=false;};
    },[dispatch]);

    if(isCheckingAuth){
        return <div className="flex min-h-screen items-center justify-center">Checking your session...</div>;
    }
    return user ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoutes
