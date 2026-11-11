import React,{useState,useRef} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Dialog, DialogContent, DialogHeader } from "./ui/dialog";
import {
    Avatar,
    AvatarImage,
    AvatarFallback
} from "./ui/avatar";
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { readFileAsDataURL } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { addPost } from '@/redux/postSlice';


const CreatePost = ({ open, setOpen }) => {
    const imageRef=useRef();
    const dispatch=useDispatch();
    const [file,setFile]=useState(null);
    const [caption,setCaption]=useState("");
    const [imagePreview,setImagePreview]=useState("");
    const [loading,setLoading]=useState(false);
    const {user}=useSelector(store=>store.auth)

    const fileChangeHandler = async (e) => {
        const selectedFile = e.target.files?.[0];
        setFile(selectedFile || null);
        setImagePreview("");

        if (selectedFile) {
            try {
                const dataUrl = await readFileAsDataURL(selectedFile);
                setImagePreview(dataUrl);
            } catch {
                toast.error('Unable to preview this image. Please choose another file.');
                setFile(null);
                e.target.value = '';
            }
        }
    }
    const createPostHandler = async (e) => {
       e.preventDefault();
       if (!file) {
           toast.error('Please select an image to post.');
           return;
       }

       const formData=new FormData();
       formData.append("caption",caption);
       formData.append("image",file);
        try {
            setLoading(true);
            const res=await axios.post('https://social-media-website-instagram-clone.onrender.com/api/v1/post/addpost',formData,{
                withCredentials:true,
            });
            if(res.data.success){
                dispatch(addPost(res.data.post));
                toast.success(res.data.message);
                setCaption("");
                setFile(null);
                setImagePreview("");
                if (imageRef.current) imageRef.current.value = '';
                setOpen(false);
            }

        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                (error.request
                    ? 'Unable to connect to the server. Please try again.'
                    : 'Unable to create post. Please try again.')
            );

        }
        finally{
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader className='text-center font-semibold'>
                    Create New Post
                </DialogHeader>

                <div className='flex gap-3 items-center'>
                    <Avatar>
                        <AvatarImage src={user?.ProfilePicture} alt="img" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  <div>
                    <h1 className='font-semibold text-xs'>{user?.username}</h1>
                    <span className='text-gray-600 text-xs'>Bio here...</span>
                  </div>
                </div>
                <Textarea value={caption} onChange={(e)=>setCaption(e.target.value)} className='focus-visible:ring-transparent border-none' placeholder='Write a caption...'/>
                    {
                        imagePreview && (
                        <div className='w-full h-64 flex items-center justify-center'>
                            <img src={imagePreview} alt='preview_img' className='object-cover h-full w-full rounded-md'/>
                        </div>
                        )
                    }
               <input ref={imageRef} type='file' accept='image/*' className='hidden' onChange={fileChangeHandler}/>

               <Button onClick={()=>imageRef.current.click()} className='w-fit mx-auto bg-[#0095F6] hover:bg-[#258bcf]'>Select from computer</Button>
               {
                imagePreview && (
                    loading ? (
                        <Button>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin'/>
                            Please wait
                        </Button>
                    ) :(
                        <Button onClick={createPostHandler} type='submit' className='w-full'>Post</Button>
                    )

                )

               }
                 
            </DialogContent>
        </Dialog>
    );
};

export default CreatePost;