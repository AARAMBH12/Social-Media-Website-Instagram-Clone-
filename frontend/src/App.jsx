import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Login from './components/Login'
import Signup from './components/Signup'
import Profile from './components/Profile'
import {createBrowserRouter,RouterProvider} from 'react-router-dom';
import MainLayout from './components/MainLayout';
import Home from './components/Home';
import EditProfile from './components/EditProfile';
import ChatPage from './components/ChatPage';
import { io } from 'socket.io-client';
import { setOnlineUsers } from './redux/chatSlice';
import { setSocket } from './redux/socketSlice';
import {
  addMessageNotification,
  expireLikeNotification,
  expireMessageNotification,
  setLikeNotification
} from './redux/rtnSlice';
import ProtectedRoutes from './components/ProtectedRoutes';
const NOTIFICATION_DURATION=2*60*1000;
const browserRouter=createBrowserRouter([
  {
    path:"/",
    element:<ProtectedRoutes><MainLayout/></ProtectedRoutes>,
    children:[
      {
        path:"/",
        element:<Home />
      },
       {
        path:"/profile/:id",
        element:<Profile />
      },
      {
        path:"/account/edit",
        element:<EditProfile />
      },
      {
        path:"/chat",
        element:<ChatPage />
      },
    ]
},
{
  path:'/login',
  element:<Login/>
},
{
  path:'/signup',
  element:<Signup/>
},
])

const App = () => {
  const { user } = useSelector(store => store.auth);
  const dispatch = useDispatch();

  useEffect(()=>{
    if (!user) return;

    const socketio=io('https://social-media-website-instagram-clone.onrender.com',{
      autoConnect:false,
      query:{
        userId:user?._id
      },
      transports:['websocket']
    });
    const expiryTimers=new Map();
    socketio.on('getOnlineUsers',(onlineUsers)=>{
      dispatch(setOnlineUsers(onlineUsers));
    });
    socketio.on('notification',(notification)=>{
      if(notification.type==='like'){
        const notificationId=`${Date.now()}-${Math.random()}`;
        dispatch(setLikeNotification({...notification,notificationId}));
        const timer=window.setTimeout(()=>{
          dispatch(expireLikeNotification(notificationId));
          expiryTimers.delete(notificationId);
        },NOTIFICATION_DURATION);
        expiryTimers.set(notificationId,timer);
      }else{
        dispatch(setLikeNotification(notification));
      }
    });
    socketio.on('newMessage',(message)=>{
      if(String(message?.receiverId)===String(user._id)){
        dispatch(addMessageNotification(message));
        if(message?._id){
          const timer=window.setTimeout(()=>{
            dispatch(expireMessageNotification(message._id));
            expiryTimers.delete(message._id);
          },NOTIFICATION_DURATION);
          expiryTimers.set(message._id,timer);
        }
      }
    });
    dispatch(setSocket(socketio));
    const connectionTimer=window.setTimeout(()=>socketio.connect(),0);
    return () =>{
      window.clearTimeout(connectionTimer);
      expiryTimers.forEach(timer=>window.clearTimeout(timer));
      expiryTimers.clear();
      socketio.off('getOnlineUsers');
      socketio.off('notification');
      socketio.off('newMessage');
      socketio.close();
      dispatch(setSocket(null));
    };
  },[user,dispatch]);

  return (
   <>
  <RouterProvider router={browserRouter}/>
   </>
  )
}

export default App
