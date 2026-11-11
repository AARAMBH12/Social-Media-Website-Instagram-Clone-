import SuggestedUsers from "@/components/SuggestedUsers";
import { createSlice } from "@reduxjs/toolkit";

const authSlice=createSlice({
    name:"auth",
    initialState:{
        user:null,
        SuggestedUsers:[],
        userProfile:null,
        selectedUser:null,
    },
    reducers:{
        setAuthUser:(state,action)=>{
            state.user=action.payload;

        },
        setSuggestedUsers:(state,action)=>{
            state.SuggestedUsers=action.payload;
        },
        setUserProfile:(state,action)=>{
            state.userProfile=action.payload;;
        },
        updateFollowState:(state,action)=>{
            const {targetUserId,isFollowing}=action.payload;
            if(state.user){
                const following=state.user.following || [];
                state.user.following=isFollowing
                    ? (following.some(id=>String(id)===String(targetUserId)) ? following : [...following,targetUserId])
                    : following.filter(id=>String(id)!==String(targetUserId));
            }

            if(state.userProfile && String(state.userProfile._id)===String(targetUserId)){
                const followers=state.userProfile.followers || [];
                state.userProfile.followers=isFollowing
                    ? (followers.some(id=>String(id)===String(state.user?._id)) ? followers : [...followers,state.user._id])
                    : followers.filter(id=>String(id)!==String(state.user?._id));
            }

            state.SuggestedUsers=state.SuggestedUsers.map(suggestedUser=>{
                if(String(suggestedUser._id)!==String(targetUserId)) return suggestedUser;
                const followers=suggestedUser.followers || [];
                return {
                    ...suggestedUser,
                    followers:isFollowing
                        ? (followers.some(id=>String(id)===String(state.user?._id)) ? followers : [...followers,state.user?._id])
                        : followers.filter(id=>String(id)!==String(state.user?._id))
                };
            });
        },
        updateBookmarkState:(state,action)=>{
            const {post,isBookmarked}=action.payload;
            const updateBookmarks=bookmarks=>{
                const currentBookmarks=bookmarks || [];
                return isBookmarked
                    ? (currentBookmarks.some(bookmark=>String(bookmark?._id ?? bookmark)===String(post._id))
                        ? currentBookmarks
                        : [post,...currentBookmarks])
                    : currentBookmarks.filter(
                        bookmark=>String(bookmark?._id ?? bookmark)!==String(post._id)
                    );
            };

            if(state.user){
                state.user.bookmarks=updateBookmarks(state.user.bookmarks);
            }

            if(state.user && String(state.user._id)===String(state.userProfile?._id)){
                state.userProfile.bookmarks=updateBookmarks(state.userProfile.bookmarks);
            }
        },
        setSelectedUser:(state,action)=>{
            state.selectedUser=action.payload;
        }
    }
});
export const {
    setAuthUser,
    setSuggestedUsers,
    setUserProfile,
    updateFollowState,
    updateBookmarkState,
    setSelectedUser
}=authSlice.actions;
export default authSlice.reducer;