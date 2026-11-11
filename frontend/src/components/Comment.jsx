import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

function Comment({comment}) {
  return (
    <div className='my-2 flex items-center gap-3'>
      <Avatar>
        <AvatarImage src={comment?.author?.profilePicture}/>
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <h1 className='font-bold text-sm '>{comment?.author?.username} <span className='font-normal pl-1'>{comment?.text}</span></h1>
    </div>
  )
}

export default Comment
