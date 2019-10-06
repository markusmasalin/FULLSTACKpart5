import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import ErrorNotification from './components/ErrorNotification' 
import SuccessNotification from './components/SuccessNotification'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import ToggleBlog from './components/ToggleBlog'
import BlogForm from './components/BlogForm'
import Footer from './components/Footer'
import SimpleBlog from './components/SimpleBlog'
import  { useField } from './hooks'

import blogService from './services/blogs'
import loginService from './services/login'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [ newAuthor, setNewAuthor ] = useState('')
  const [ newTitle, setNewTitle ] = useState('')
  const [ newUrl, setNewUrl ] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')
  const username = useField('text')
  const password = useField('text')
  // const [username, setUsername] = useState('')
  // const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [loginVisible, setLoginVisible] = useState(false)

  useEffect(() => {
    blogService
      .getAll()
      .then(initialBlogs => setBlogs(initialBlogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    

    try {
      const user = await loginService.login({
        username, password
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      console.log(window.localStorage)
      blogService.setToken(user.token)
      setUser(user)
      username.reset()
      password.reset()
      setSuccessMessage(user.name+ 'has logged in')
    } catch (exception) {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = async (event) => {
    console.log('logging out ')
    try {
      window.localStorage.removeItem(
        'loggedBlogappUser'
      )
      console.log(window.localStorage)
      console.log(event)
      setUser(null)
      setSuccessMessage('logout succeeded')
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    } catch (exception) {
      setErrorMessage('logout did not work')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const rows = () => blogs.sort((b, a) => (a.likes - b.likes)).map(blog => {
    const blogStyle = {
      paddingTop: 10,
      paddingLeft: 2,
      border: 'solid',
      borderWidth: 1,
      marginBottom: 5
    }
    let blogUser = null
    if( blog.user !== undefined ) {
      blogUser = blog.user.username
      console.log(blogUser)
    }
    console.log(user.username + ('user'))
    return(
      <div style={blogStyle} key={blog.id}>
        <ToggleBlog title={blog.title} author={blog.author} >
          <Blog
            key={blog.id}
            blog={blog}
            blogUser={blogUser}
            user={user}
            addingNewLike={() => addingNewLike(blog)}
            deleteBlog={() => deleteBlog(blog)}
          />
        </ToggleBlog>
      </div>
    )
  })

  const testrows = () => blogs.map(b => {
    return(
      <SimpleBlog
        key={b.author}
        blog={b}
        onClick={() => addingNewTestLike(b)}
      />
    )
  })

  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>log in</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            username={username}
            password={password}
            handleSubmit={handleLogin}
          />
          <button onClick={() => setLoginVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }

  const blogFormRef = React.createRef()

  const handleAuthorChange = (event) => {
    setNewAuthor(event.target.value)
  }
  const handleTitleChange = (event) => {
    setNewTitle(event.target.value)
  }
  const handleUrlChange = (event) => {
    setNewUrl(event.target.value)
  }

  const addBlog = async(event) => {
    event.preventDefault()
    blogFormRef.current.toggleVisibility()
    console.log('submitting blog')
    const blogObject = {
      author: newAuthor,
      title: newTitle,
      url: newUrl,
      id: blogs.length + 1,
    }
    try {
      const addedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(addedBlog))
      setNewAuthor('')
      setNewTitle('')
      setNewUrl('')
      setSuccessMessage(
        `${blogObject.title} is added to the list`
      )
      console.log(successMessage)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)

    } catch (exception) {
      setErrorMessage(
        `'${blogObject.title} is not added to bloglist'`
      )
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const deleteBlog = async (event) => {
    blogFormRef.current.toggleVisibility()
    const blog = blogs.find(p => p.title === event.title)
    console.log('blog' + blog)
    console.log('id' + event.id)
    const ok = window.confirm(`Delete ${blog}?`)
    if (ok){
      try{
        await blogService.deleteBlog(event.id)
        setBlogs(blogs.filter(p => p.id !== event.id)) 
        setSuccessMessage(
          `${blog.author} is deleted from the list`
        )
        console.log(successMessage)
        setTimeout(() => {
          setSuccessMessage(null)
        }, 5000)

      } catch (exception) {
        setErrorMessage(
          `${blog.author} is deleted from the list`
        )
        console.log(errorMessage)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)

      }
    }
  }

  const addingNewLike = async (event) => {
    blogFormRef.current.toggleVisibility()
    console.log('updating blog')
    const updatedBlogObject = {
      author: event.author,
      title: event.title,
      url: event.url,
      likes: event.likes + 1,
    }
    console.log(event.likes)
    try{
      const likedBlog = await blogService.update(event.id, updatedBlogObject)    
      setSuccessMessage(
        `thank you for liking  ${event.title} `
      )
      setBlogs(blogs.map(blog => blog.id !== event.id ? blog : likedBlog))
      console.log(successMessage)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)

    } catch (exception) {
      setErrorMessage(
        `${event.author} is probably deleted`
      )
      console.log(errorMessage)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const addingNewTestLike = async (event) => {
    console.log('new like')

    try{
      console.log(event.likes)
    } catch (exception) {
      console.log('something went wrong')
    }
  }

  return (
    <div>
      <h2>Blogit</h2>
      <ErrorNotification message={errorMessage} />
      <SuccessNotification message={successMessage} />
      {user === null ?
        loginForm() :
        <div>
          <p>{user.name} logged in</p>
          <Togglable buttonLabel="create" ref={blogFormRef}>
            <BlogForm
              onSubmit={addBlog}
              newAuthor={newAuthor}
              handleAuthorChange={handleAuthorChange}
              newTitle={newTitle}
              handleTitleChange={handleTitleChange}
              newUrl={newUrl}
              handleUrlChange={handleUrlChange}
            />
          </Togglable>
          <button onClick={() => handleLogout()}>logout</button>
          <h3>Blogit</h3>
          {rows()}
          {testrows()}
          
          <Footer> </Footer>
        </div>
      }
    </div>
  )
}
export default App


