
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import React, { useEffect, useRef, useState } from 'react';
import { Dialog, DialogTrigger, DialogContent } from './ui/dialog';
import { Bookmark, MoreHorizontal, Send, MessageCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import CommentDialog from './CommentDialog';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'sonner';
import { removePost, setPosts, setSelectedPost } from '../redux/postSlice';
import { updateBookmarkState } from '../redux/authSlice';

const isPostLikedByUser = (likes, userId) =>
  Boolean(
    userId &&
    likes?.some(like =>
      String(like?._id ?? like) === String(userId)
    )
  );

const Post = ({ post }) => {
  const [text, setText] = useState('');
  const [open, setOpen] = useState(false);

  const { user } = useSelector(store => store.auth);
  const { posts } = useSelector(store => store.post);
  const isOwnPost = String(user?._id) === String(post?.author?._id);
  const isBookmarked = user?.bookmarks?.some(
    bookmark => String(bookmark?._id ?? bookmark) === String(post?._id)
  ) || false;

  const [liked, setLiked] = useState(
    () => isPostLikedByUser(post.likes, user?._id)
  );

  const [postLike, setPostLike] = useState(post.likes?.length || 0);
  const [isLiking, setIsLiking] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);
  const [comment, setComment] = useState(post.comments || []);

  const likeRequestInFlight = useRef(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setLiked(isPostLikedByUser(post.likes, user?._id));
    setPostLike(post.likes?.length || 0);
    setComment(post.comments || []);
  }, [post.likes, post.comments, user?._id]);

  const changeEventHandler = (e) => {
    setText(e.target.value);
  };

  const likeOrDislikeHandler = async () => {
    if (likeRequestInFlight.current) return;

    likeRequestInFlight.current = true;
    setIsLiking(true);

    const wasLiked = liked;
    const shouldLike = !wasLiked;

    setLiked(shouldLike);
    setPostLike(count =>
      Math.max(0, count + (shouldLike ? 1 : -1))
    );

    try {
      const action = wasLiked ? 'dislike' : 'like';

      const res = await axios.get(
        `http://localhost:8000/api/v1/post/${post._id}/${action}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message);
      } else {
        setLiked(wasLiked);
        setPostLike(count =>
          Math.max(0, count + (wasLiked ? 1 : -1))
        );
        toast.error(res.data.message || 'Unable to update like');
      }
    } catch (error) {
      setLiked(wasLiked);
      setPostLike(count =>
        Math.max(0, count + (wasLiked ? 1 : -1))
      );

      toast.error(
        error.response?.data?.message ||
        'Unable to update like. Please try again.'
      );
    } finally {
      likeRequestInFlight.current = false;
      setIsLiking(false);
    }
  };

  const commentHandler = async () => {
    if (!text.trim() || isCommenting) return;

    try {
      setIsCommenting(true);

      const res = await axios.post(
        `http://localhost:8000/api/v1/post/${post._id}/comment`,
        { text: text.trim() },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );

      if (res.data.success) {
        const updatedCommentData = [
          ...(Array.isArray(comment) ? comment : []),
          res.data.comment
        ];

        setComment(updatedCommentData);

        const updatedPostData = posts.map(p =>
          p._id === post._id
            ? { ...p, comments: updatedCommentData }
            : p
        );

        dispatch(setPosts(updatedPostData));
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

  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:8000/api/v1/post/delete/${post._id}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        dispatch(removePost(post._id));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);

      const message = error.response?.data?.message;

      if (
        error.response?.status === 404 &&
        message === 'Post not found'
      ) {
        dispatch(removePost(post._id));
      }

      toast.error(
        message || 'Unable to delete post. Please try again.'
      );
    }
  };
  const bookmarkHandler =async() =>{
    if(isBookmarking) return;
    setIsBookmarking(true);
    try {
      const res=await axios.get(`http://localhost:8000/api/v1/post/${post?._id}/bookmark`,{withCredentials:true});
      if(res.data.success){
        dispatch(updateBookmarkState({
          post,
          isBookmarked:res.data.type==='saved'
        }));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        (error.request
          ? 'Unable to update saved posts. Please check your connection and try again.'
          : 'Unable to update saved posts. Please try again.')
      );
    } finally {
      setIsBookmarking(false);
    }
  }

  return (
    <div className="my-8 w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage
              src={post.author?.profilePicture}
              alt="post_image"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className='flex items-center gap-3'>
              <h1>{post.author?.username}</h1>
             {isOwnPost && <Badge varient="secondary" className="rounded-sm">Author</Badge> } 

          </div>

        
        </div>

        <Dialog>
          <DialogTrigger>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>

          <DialogContent className="flex flex-col items-center text-sm text-center">
            {!isOwnPost && (
              <Button
                variant="ghost"
                className="cursor-pointer w-fit text-[#ED4956] font-bold"
              >
                Unfollow
              </Button>
            )}

            <Button
              variant="ghost"
              className="cursor-pointer w-fit"
            >
              Add to Favorites
            </Button>

            {isOwnPost && (
              <Button
                variant="ghost"
                onClick={deletePostHandler}
                className="cursor-pointer w-fit"
              >
                Delete
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <img
        className="rounded-sm my-2 w-full aspect-square object-cover"
        src={post.image || undefined}
        alt="post_img"
      />

      <div className="flex items-center justify-between my-2">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={likeOrDislikeHandler}
            disabled={isLiking}
            aria-label={liked ? 'Unlike post' : 'Like post'}
            aria-pressed={liked}
            className="cursor-pointer hover:text-gray-600"
          >
            {liked ? (
              <FaHeart
                size="22px"
                className="text-[#ED4956]"
              />
            ) : (
              <FaRegHeart size="22px" />
            )}
          </button>

          <MessageCircle onClick={()=>{
            dispatch(setSelectedPost(post));
            setOpen(true);
          }}
           
            className="cursor-pointer hover:text-gray-600"
          />

          <Send className="cursor-pointer hover:text-gray-600" />
        </div>

        <button
          type="button"
          onClick={bookmarkHandler}
          disabled={isBookmarking}
          aria-label={isBookmarked ? 'Remove saved post' : 'Save post'}
          aria-pressed={isBookmarked}
          className="cursor-pointer disabled:opacity-50"
        >
          <Bookmark
            className={`transition-colors ${isBookmarked ? 'fill-red-500 text-red-500' : 'hover:text-gray-600'}`}
          />
        </button>
      </div>

      <span className="font-medium block mb-2">
        {postLike} likes
      </span>

      <p>
        <span className="font-medium mr-2">
          {post.author?.username}
        </span>
        {post.caption}
      </p>
      {
        comment.length>0 && (
           <span
      onClick={()=>{
            dispatch(setSelectedPost(post));
            setOpen(true);
          }}
        className="cursor-pointer text-sm text-gray-400"
      >
        View all {comment.length} comments
      </span>


        )
      }

     
      <CommentDialog
        open={open}
        setOpen={setOpen}
        post={post}
      />

      <div className="flex items-center justify-between mt-2">
        <input
          type="text"
          placeholder="Add a Comment..."
          value={text}
          onChange={changeEventHandler}
          onKeyDown={e => {
            if (e.key === 'Enter') commentHandler();
          }}
          className="outline-none text-sm w-full"
        />

        {text.trim() && (
          <button
            type="button"
            onClick={commentHandler}
            disabled={isCommenting}
            className="text-[#3BADF8] cursor-pointer disabled:opacity-50"
          >
            {isCommenting ? 'Posting...' : 'Post'}
          </button>
        )}
      </div>
    </div>
  );
};

export default Post;
