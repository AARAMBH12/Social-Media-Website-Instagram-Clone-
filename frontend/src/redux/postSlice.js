import {createSlice } from "@reduxjs/toolkit";
const postSlice=createSlice({
    name:'post',
    initialState:{
        posts:[],
        selectedPost:null,
    },
    reducers:{
        setPosts:(state,action)=>{
            state.posts=action.payload;



        },
        setSelectedPost:(state,action)=>{
            state.selectedPost=action.payload;
        },
        addCommentToPost:(state,action)=>{
            const {postId,comment}=action.payload;
            const post=state.posts.find(post=>post._id===postId);
            if(post){
                post.comments=[...(post.comments || []),comment];
            }
            if(state.selectedPost?._id===postId){
                state.selectedPost.comments=[...(state.selectedPost.comments || []),comment];
            }
        },
        addPost:(state,action)=>{
            state.posts.unshift(action.payload);
        },
        removePost:(state,action)=>{
            state.posts=state.posts.filter(post=>post._id!==action.payload);
        }

        
    }


});
export const {setPosts,addPost,removePost,setSelectedPost,addCommentToPost}=postSlice.actions;
export default postSlice.reducer;