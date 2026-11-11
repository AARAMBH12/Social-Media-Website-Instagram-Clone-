import useGetUserProfile from '@/hooks/useGetUserProfile'
import { Avatar, AvatarImage,AvatarFallback } from './ui/avatar'
import { Link, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { AtSign, Heart, MessageCircle } from 'lucide-react'
import React,{useState} from 'react'
import FollowButton from './FollowButton'

const Profile = () => {
  const params=useParams();
  const userId=params.id;
  useGetUserProfile(userId);
  const [activeTab,setActiveTab]=useState('posts');
  const {userProfile,user}=useSelector(store=>store.auth);
  const isLoggedInUserProfile=String(user?._id)===String(userProfile?._id);

  const handleTabChange=(tab)=>{
    setActiveTab(tab);
  }
  const displayedPosts = activeTab === 'posts'
    ? userProfile?.posts
    : userProfile?.bookmarks;
  return (
    <div className='mx-auto w-full max-w-5xl pl-10'>
      <div className='flex w-full flex-col gap-20 p-8'>
        <div className='grid w-full grid-cols-2'>
        <section className='flex items-center justify-center'>
          <Avatar className='h-32 w-32'>
        <AvatarImage src={userProfile?.profilePicture} alt="profilephoto"/>
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>

        </section>
        <section>
          <div className='flex flex-col gap-5 '> 
            <div className='flex items-center gap-2'>
              <span>{userProfile?.username}</span>
              {
                isLoggedInUserProfile ? (
                   <>
              <Link to="/account/edit"><Button variant='secondary' >Edit Profile</Button></Link>
             <Button variant='secondary' >View archive</Button>
              <Button variant='secondary'>Ad tools</Button>


            </>

                ):(
                 
                  <FollowButton targetUser={userProfile}/>

                )
              }
           

            </div>
            <div className='flex items-center gap-4'>
               <p><span className='font-semibold'>{userProfile?.posts?.length ?? 0} </span>posts</p>
                <p><span className='font-semibold'>{userProfile?.followers?.length ?? 0} </span>followers</p>
                <p><span className='font-semibold'>{userProfile?.following?.length ?? 0} </span>following</p>
            </div>
            <div className='flex flex-col gap-1'>
              <span className='font-semibold'>{userProfile?.bio || 'bio here...'}</span>
              <Badge className='w-fit ' variant='secondary'><AtSign/><span className='pl-1'>{userProfile?.username}</span></Badge>
              <span>Learn Code  with @aarambh</span>
              <span>Coding is Fun</span>
              <span>Turning ideas into Reality</span>
            </div>
            
          
          </div>
        </section>
      </div>
      <div className='border-t border-t-gray-200'>
        <div className='flex items-center justify-center gap-10 text-sm'>
          <button type='button' className={`py-3 cursor-pointer ${activeTab==='posts' ? 'font-bold' : ''}`} onClick={()=>handleTabChange('posts')}>
            POSTS
          </button>
           
         <button
  type='button'
  className={`py-3 cursor-pointer ${activeTab === 'saved' ? 'font-bold' : ''}`}
  onClick={() => handleTabChange('saved')}
>
            SAVED
          </button>
          <span className='py-3 cursor-pointer'>
            REELS
          </span>
          <span className='py-3 cursor-pointer'>
           TAGS
          </span>


        </div>
        <div className='grid w-full grid-cols-3 gap-1'>
          {
            displayedPosts?.map((post)=>{
              return (
                <div key={post?._id} className=' relative group cursor-pointer aspect-square overflow-hidden'>
                  <img
                    src={post?.image || undefined}
                    alt={post?.caption || 'Post'}
                    className='h-full w-full object-cover'
                  />
                  <div className='absolute inset-0 flex items-center justify-center rounded bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
                    <div className='flex items-center text-white space-x-4'>
                      <Button type='button' className='flex items-center gap-2 hover:text-gray-300'>
                        <Heart/>
                        <span>{post?.likes?.length ?? 0}</span>
                      </Button>
                       <Button type='button' className='flex items-center gap-2 hover:text-gray-300'>
                        <MessageCircle/>
                        <span>{post?.comments?.length ?? 0}</span>
                      </Button>

                    </div>
                  </div>
                  </div>
              )
            })
          }
        </div>

      </div>

      </div>
      
      
    </div>
  )
}

export default Profile
