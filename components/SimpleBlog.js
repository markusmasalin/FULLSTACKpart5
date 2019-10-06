import React from 'react'

const SimpleBlog = ({ blog, addingNewTestLike }) => (
  <div  className='blog'>
    <div>
      {blog.title} {blog.author}
    </div>
    <div className={'likes'}>
      blog has {blog.likes} likes
      <button onClick={addingNewTestLike}>like</button>
    </div>
  </div>
)

export default SimpleBlog