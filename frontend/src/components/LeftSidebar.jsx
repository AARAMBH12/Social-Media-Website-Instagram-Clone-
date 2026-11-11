import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Home, Search, TrendingUp, MessageCircle, Heart, PlusSquare, LogOut } from 'lucide-react';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import CreatePost from './CreatePost';
import { setAuthUser } from '../redux/authSlice';
import {
    clearLikeNotifications,
    clearMessageNotifications,
    clearMessageNotificationsForSender
} from '../redux/rtnSlice';
import { setSelectedUser } from '../redux/authSlice';


const LeftSidebar = () => {
    const navigate=useNavigate();
    const {user,SuggestedUsers=[]} =useSelector(store=>store.auth);
    const {likeNotification=[],messageNotification=[]}=useSelector(store=>store.realTimeNotification);
    const dispatch=useDispatch();
    const [open,setOpen]=useState(false);
    const [messagePopoverOpen,setMessagePopoverOpen]=useState(false);
    const logoutHandler=async()=>{
        try{
            const res=await axios.get('http://localhost:8000/api/v1/user/logout',{
                withCredentials:true
            });
            if(res.data.success){
                dispatch(clearLikeNotifications());
                dispatch(clearMessageNotifications());
                dispatch(setAuthUser(null));
                navigate('/login');
                toast.success(res.data.message);
            }

        }catch(error){
            toast.error(
                error.response?.data?.message ||
                (error.request
                    ? 'Unable to connect to the server. Please try again.'
                    : 'Logout failed. Please try again.')
            );
        }
    }
      const sidebarHandler=(textType)=>{
       if(textType==="Logout"){
        logoutHandler();
       }else if(textType==="Create"){
        setOpen(true);
       }else if(textType==="Profile"){
        navigate(`/profile/${user._id}`);
       }else if(textType==="Home"){
        navigate("/")
       }else if(textType==='Messages'){
         navigate("/chat")
        }
    };
    const openMessage=(message)=>{
         const sender=SuggestedUsers.find(
             suggestedUser=>String(suggestedUser._id)===String(message.senderId)
         ) || {
             _id:message.senderId,
             username:'New message',
             profilePicture:''
         };
         dispatch(setSelectedUser(sender));
         dispatch(clearMessageNotificationsForSender(message.senderId));
         setMessagePopoverOpen(false);
         navigate('/chat');
    };
    const SidebarItems=[
    { icon:<Home/>,text:"Home"},
     { icon:<Search/>,text:"Search"},
    { icon:<TrendingUp/>,text:"Explore"},
    { icon:<MessageCircle/>,text:"Messages"},
        { icon:<Heart/>,text:"Notifications"},
         { icon:<PlusSquare/>,text:"Create"},
        { icon:(
            <Avatar className="h-8 w-8">
                <AvatarImage src={user?.profilePicture || "https://github.com/shadcn.png"} />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
        ),
        text:"Profile"
    },
        { icon:<LogOut/>,text:"Logout"},

   

]

  
  return (
    <div  className=' fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen' >
        <div className='flex flex-col '>
            <h1 className='my-8 pl-3 font-bold text-xl'>LOGO</h1>
            <div>

          
              {
            SidebarItems.map((item,index)=>{
               if(item.text==='Messages'){
                return (
                    <Popover key={item.text} open={messagePopoverOpen} onOpenChange={setMessagePopoverOpen}>
                        <PopoverTrigger
                            type="button"
                            className="flex w-full items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3 text-left"
                        >
                            {item.icon}
                            <span>{item.text}</span>
                            {messageNotification.length>0 && (
                                <span className="rounded-full h-5 min-w-5 px-1 absolute bottom-6 left-6 bg-red-500 text-white text-xs flex items-center justify-center">
                                    {messageNotification.length}
                                </span>
                            )}
                        </PopoverTrigger>
                        <PopoverContent className="w-80 max-h-96 overflow-y-auto">
                            <div className="flex flex-col gap-3">
                                <h2 className="font-semibold">Messages</h2>
                                {messageNotification.length===0 ? (
                                    <p className="text-sm text-gray-500">No new messages</p>
                                ) : (
                                    [...messageNotification].reverse().map((message)=> {
                                        const sender=SuggestedUsers.find(
                                            suggestedUser=>String(suggestedUser._id)===String(message.senderId)
                                        );
                                        return (
                                            <button
                                                type="button"
                                                key={message._id}
                                                onClick={()=>openMessage(message)}
                                                className="flex w-full items-center gap-2 rounded-md p-2 text-left hover:bg-gray-100"
                                            >
                                                <Avatar>
                                                    <AvatarImage src={sender?.profilePicture}/>
                                                    <AvatarFallback>{sender?.username?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                                                </Avatar>
                                                <span className="min-w-0 flex-1">
                                                    <span className="block font-bold">{sender?.username || 'New message'}</span>
                                                    <span className="block truncate text-sm text-gray-500">{message.message}</span>
                                                </span>
                                            </button>
                                        );
                                    })
                                )}
                                <button
                                    type="button"
                                    onClick={()=>{setMessagePopoverOpen(false); navigate('/chat');}}
                                    className="text-left text-sm font-medium text-blue-600 hover:underline"
                                >
                                    Open messages
                                </button>
                            </div>
                        </PopoverContent>
                    </Popover>
                );
               }

               if(item.text==='Notifications'){
                return (
                    <Popover key={item.text}>
                        <PopoverTrigger
                            type="button"
                            className="flex w-full items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3 text-left"
                        >
                            {item.icon}
                            <span>{item.text}</span>
                            {likeNotification.length>0 && (
                                <span className="rounded-full h-5 min-w-5 px-1 absolute bottom-6 left-6 bg-red-500 text-white text-xs flex items-center justify-center">
                                    {likeNotification.length}
                                </span>
                            )}
                        </PopoverTrigger>
                        <PopoverContent>
                            <div className="flex flex-col gap-3">
                                {likeNotification.length===0 ? (
                                    <p>No new notifications</p>
                                ) : (
                                    likeNotification.map((notification)=>(
                                        <div key={`${notification.postId}-${notification.userId}`} className="flex items-center gap-2">
                                            <Avatar>
                                                <AvatarImage src={notification.userDetails?.profilePicture}/>
                                                <AvatarFallback>CN</AvatarFallback>
                                            </Avatar>
                                            <p className="text-sm">
                                                <span className="font-bold">{notification.userDetails?.username}</span>
                                                {' liked your post'}
                                            </p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </PopoverContent>
                    </Popover>
                );
               }

               return (
                <div onClick={()=>sidebarHandler(item.text)} key={index} className='flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3 '>
                    {item.icon}
                    <span>{item.text}</span>
                </div>
               )
            })
        }
          </div>

        </div>
        <CreatePost open={open} setOpen={setOpen}/>
       
      
    </div>
  )
}

export default LeftSidebar
