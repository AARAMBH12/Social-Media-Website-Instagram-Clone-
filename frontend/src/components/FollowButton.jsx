import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { updateFollowState } from '../redux/authSlice';

const FollowButton = ({ targetUser }) => {
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const isSelf = String(user?._id) === String(targetUser?._id);
    const isFollowing = user?.following?.some(
        followedUserId => String(followedUserId) === String(targetUser?._id)
    ) || false;

    if (!user || !targetUser?._id || isSelf) return null;

    const toggleFollow = async () => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            const res = await axios.post(
                `https://social-media-website-instagram-clone.onrender.com/api/v1/user/followorunfollow/${targetUser._id}`,
                {},
                { withCredentials: true }
            );
            if (!res.data.success) {
                throw new Error(res.data.message || 'Unable to update follow status.');
            }
            dispatch(updateFollowState({
                targetUserId: targetUser._id,
                isFollowing: res.data.isFollowing
            }));
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || 'Unable to update follow status.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            type="button"
            variant={isFollowing ? 'secondary' : 'default'}
            className={isFollowing ? 'h-8' : 'h-8 bg-[#0095F6] hover:bg-[#3192d2]'}
            disabled={isLoading}
            onClick={toggleFollow}
        >
            {isLoading ? 'Please wait...' : isFollowing ? 'Unfollow' : 'Follow'}
        </Button>
    );
};

export default FollowButton;
