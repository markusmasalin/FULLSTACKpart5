import React from 'react'
const Blog = ({ blog, deleteBlog, blogUser, user, addingNewLike }) => {
  if (blogUser === undefined) {
    return (
      <div className='blog'>
        <div>  {blog.url} </div>
        <div>   {blog.likes}{' likes '} <button onClick={addingNewLike}>like</button>  </div>
        <div>{'added by '} {blogUser}</div>
      </div>
    )
  }
  if (user === undefined) {
    return (
      <div className='blog'>
        <div>  {blog.url} </div>
        <div>   {blog.likes}{' likes '} <button onClick={addingNewLike}>like</button>  </div>
        <div>{'added by '} {blogUser}</div>
      </div>
    )
  }
  if (blogUser === user.username) {
    return (
      <div className='blog'>
        <div>  {blog.url} </div>
        <div>   {blog.likes}{' likes '} <button onClick={addingNewLike}>like</button>  </div>
        <button onClick={deleteBlog}>delete</button>
        <div>{'added by '} {blogUser}</div>
      </div>
    )

  } else {
    return (
      <div className='blog'>
        <div>  {blog.url} </div>
        <div>   {blog.likes}{' likes '} <button onClick={addingNewLike}>like</button>  </div>
        <div>{'added by '} {blogUser}</div>
      </div>
    )
  }
}
export default Blog