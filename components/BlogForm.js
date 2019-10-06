import React from 'react'

const BlogForm = ({
  onSubmit,
  handleAuthorChange,
  newAuthor,
  newTitle,
  handleTitleChange,
  newUrl,
  handleUrlChange
}) => {
  return (
    <div>
      <h2>Create a new blog</h2>

      <form onSubmit={onSubmit}>
        <div>
            Author
          <input
            value={newAuthor}
            name={newAuthor}
            onChange={handleAuthorChange}
            className="authorInput"
          />
        </div>
        <div>
            Title
          <input
            value={newTitle}
            name={newTitle}
            onChange={handleTitleChange}
            className="titleInput"
          />
        </div>
        <div>
            Url
          <input
            value={newUrl}
            name={newUrl}
            onChange={handleUrlChange}
            className="urlInput"
          />
        </div>
        <button type="submit">Send</button>
      </form>
    </div>
  )
}




export default BlogForm