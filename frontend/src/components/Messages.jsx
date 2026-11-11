import { Button } from './ui/button'
import {
  Avatar,
  AvatarImage,
  AvatarFallback
} from './ui/avatar'

import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import useGetAllMessage from '@/hooks/useGetAllMessage'
import useGetRTM from '@/hooks/useGetRTM'

const Messages = ({ selectedUser }) => {
  useGetRTM(selectedUser);
  useGetAllMessage();
  const {messages}=useSelector(store=>store.chat);
  const {user}=useSelector(store=>store.auth);

  return (
    <div className='overflow-y-auto flex-1 p-4'>

      <div className='flex justify-center'>
        <div className='flex flex-col items-center justify-center'>

          <Avatar className='h-20 w-20'>
            <AvatarImage
              src={selectedUser?.profilePicture}
              alt='profile'
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>

          <span>{selectedUser?.username}</span>

          <Link to={`/profile/${selectedUser?._id}`}>
            <Button className="h-8 my-2" variant="secondary">
              View Profile
            </Button>
          </Link>

        </div>
      </div>

      <div className='flex flex-col gap-3'>
        {
         messages.map((msg) => {
            const isSentByCurrentUser = String(msg.senderId) === String(user?._id);
            return (
              <div key={msg._id} className={`flex ${isSentByCurrentUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] rounded-lg px-3 py-2 ${isSentByCurrentUser ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-900'}`}>
                  {msg.message}
                </div>
              </div>
            )
          })
        }
      </div>

    </div>
  )
}

export default Messages