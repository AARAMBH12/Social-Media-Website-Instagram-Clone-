import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import FollowButton from './FollowButton';

const SuggestedUsers = () => {
    const {SuggestedUsers,user:currentUser}=useSelector(store=>store.auth);
    const suggestedUsers = Array.isArray(SuggestedUsers) ? SuggestedUsers : [];
    const otherUsers=suggestedUsers.filter(
        suggestedUser=>String(suggestedUser?._id)!==String(currentUser?._id)
    );
  return (
    <div className='my-10'>
        <div className='flex items-center justify-between text-sm gap-3'>
            <h1 className='font-bold text-gray-600'>Suggested for you</h1>
            <span className='font-medium cursor-pointer'>See All</span>
        </div>
        {
            otherUsers.map((user)=>{
                return(
                    <div key={user._id} className='flex items-center justify-between my-5'>
                         <div className="flex items-center gap-2">
        <Link to={`/profile/${user?._id}`}>
        <Avatar>
            <AvatarImage
              src={user?.profilePicture}
              alt="post_image"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Link>
          
          <div>
              <h1 className='font-semibold text-sm'><Link to={`/profile/${user?._id}`}>{user?.username}</Link></h1>
              <span className='text-gray-600 text-sm'>{user?.bio || 'Bio here...'}</span>


          </div>

        
        </div>
        <FollowButton targetUser={user}/>

    </div>
                )
            })
        }
      
    </div>
  )
}

export default SuggestedUsers
