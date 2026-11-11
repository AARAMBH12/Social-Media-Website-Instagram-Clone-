import React,{useEffect, useState} from 'react'
import {Dialog,DialogContent,DialogTrigger } from './ui/dialog'
import {Avatar,AvatarImage, AvatarFallback } from './ui/avatar'
import { Link } from 'react-router-dom'
import { MoreHorizontal } from 'lucide-react'
import { Button } from './ui/button'
import { useDispatch, useSelector } from 'react-redux'
import Comment from './Comment'
import axios from 'axios'
import { toast } from 'sonner'
import { addCommentToPost } from '../redux/postSlice'

const CommentDialog = ({open,setOpen}) => {
    const [text,setText]=useState("");
    const [isCommenting,setIsCommenting]=useState(false);
    const {selectedPost}=useSelector(store=>store.post);
    const {user}=useSelector(store=>store.auth);
    const isOwnPost=String(user?._id)===String(selectedPost?.author?._id);
    const [comment,setComment]=useState([]);
    const dispatch=useDispatch();
    useEffect(()=>{
      if(selectedPost){
        setComment(selectedPost.comments)
      }
    },[selectedPost]);
    const changeEventHandler=(e)=>{
        setText(e.target.value);
    }
  
     const sendMessageHandler = async () => {
    if (!text.trim() || isCommenting) return;

    try {
      setIsCommenting(true);

      const res = await axios.post(
        `http://localhost:8000/api/v1/post/${selectedPost?._id}/comment`,
        { text: text.trim() },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );

      if (res.data.success) {
        dispatch(addCommentToPost({
          postId:selectedPost._id,
          comment:res.data.comment
        }));
        setText('');

        toast.success(res.data.message || 'Comment added');
      }
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
        'Failed to add comment'
      );
    } finally {
      setIsCommenting(false);
    }
  };
   
  return (
   <Dialog open={open} onOpenChange={setOpen} >
   
    <DialogContent className="!w-[min(95vw,110vh)] !max-w-none aspect-[1.6/1] overflow-hidden p-0 flex flex-col">
         <div className='flex h-full min-h-0 flex-1'>
             <div className='w-3/5 min-h-0'>
            <img  src={selectedPost?.image || undefined}
         alt=" post_img" 
         className='w-full h-full object-cover rounded-l-lg'
         />

            </div>
        

         <div className='w-2/5 flex flex-col justify-between '>
            <div className='flex items-center justify-between p-4'>
                <div className='flex gap-3 items-center'>
                    <Link>
                  <Avatar>
                    <AvatarImage src={selectedPost?.author?.profilePicture}/>
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                  
                </Link>
                <div>
                    <Link className='font-semibold text-xs'>{selectedPost?.author?.username}</Link>
                    {/* <span className='text-gray-600 text-sm'>Bio here...</span> */}
                </div>

                </div>
                <Dialog>
                    <DialogTrigger>
                        <MoreHorizontal className='cursor-pointer'/>

                    </DialogTrigger>
                    <DialogContent className="flex flex-col items-center text-sm text-center">
                        {!isOwnPost && (
                          <div className='cursor-pointer w-full text-[#ED4956] font-bold'>
                              Unfollow
                          </div>
                        )}
                        <div className='cursor-pointer w-full '>
                            Add to favourites
                        </div>
                    </DialogContent>
                </Dialog>
                
              

            </div>
            <hr/>
            <div className='flex-1 overflow-y-auto max-h-96 p-4'>
                {Array.isArray(selectedPost?.comments) && selectedPost.comments.map((comment) => (
                    <Comment key={comment._id} comment={comment} />
                ))}
            </div>
            <div className='p-4'>
                <div className='flex items-center gap-2'> 
                    <input type='text'value={text} onChange={changeEventHandler} placeholder='Add a comment...' className='w-full outlin-none border-gray-300 p-2 rounded' />
                    <Button disabled={!text.trim() || isCommenting} onClick={sendMessageHandler} variant='outline'>
                        {isCommenting ? 'Sending...' : 'Send'}
                    </Button>
                </div>

            </div>
         </div>


    </div>
       


    </DialogContent>
   </Dialog>
  )
}

export default CommentDialog
