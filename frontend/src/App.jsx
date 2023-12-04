import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import Notification from './components/Notification'
import loginService  from './services/login'
import './index.css'
import BlogSubmitForm from './components/BlogSubmit'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [notification, setNotification] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    const getBlogsFromDB = async () => {
      const blogs = await blogService.getAll()
      setBlogs(blogs)
    }

    getBlogsFromDB()
  }
  , [])

  useEffect(() => {
    const savedUserJSON = window.localStorage.getItem('loggedBlogUser')
    if (savedUserJSON) {
      const savedUser = JSON.parse(savedUserJSON)
      setUser(savedUser)
      blogService.setToken(savedUser.token)
    }
  }, [])

  const displayNotification = (notification) => {
    setNotification(notification)
    setTimeout(() =>
      setNotification(null),
    5000
    )
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem('loggedBlogUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      console.log(exception)
      displayNotification({
        message: 'Wrong credentials!',
        type: 'error'
      })
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogUser')
    setUser(null)
  }

  const handleBlogLike = async (blog) => {
    const updatedBlogObject = {
      ...blog,
      likes: blog.likes + 1
    }

    const updatedBlog = await blogService.updateEntry(blog.id, updatedBlogObject)

    const newBlogList = [...blogs]

    newBlogList.forEach(blog => {
      if (blog.id === updatedBlog.id) {
        blog.likes = updatedBlog.likes
      }
    })

    setBlogs(newBlogList)
  }

  const handleBlogDelete = async (blogToDelete) => {
    try {
      await window.confirm(`Remove blog ${blogToDelete.title} by ${blogToDelete.author}?`)
    } catch(error) {
      null
    }

    await blogService.removeEntry(blogToDelete)

    const newBlogList = blogs.filter((blog) => blog.id !== blogToDelete.id)

    setBlogs(newBlogList)
  }

  const handleNewBlog = async (blogObject) => {
    const addedBlog = await blogService.addEntry(blogObject)

    displayNotification({
      message: `A new blog ${addedBlog.title} by ${addedBlog.author} added`,
      type: 'success'
    })

    setBlogs( blogs.concat(addedBlog))
    blogFormRef.current.toggleVisibility()
  }

  const loginForm = () => (
    <div>
      <h2>Log in to application</h2>
      <Notification notification={notification} />
      <form onSubmit={handleLogin}>
        <div>
        username
          <input
            type="text"
            value={username}
            name='Username'
            onChange={({ target }) => setUsername(target.value)}
            id="usernameInput"
          />

        </div>
        <div>
      password
          <input
            type='password'
            value={password}
            name='Password'
            onChange={({ target }) => setPassword(target.value)}
            id='passwordInput'
          />
        </div>
        <button type='submit'>login</button>
      </form>

    </div>
  )

  const blogList = () => {
    const sortedBlogList = blogs.toSorted((blog_a, blog_b) => blog_b.likes - blog_a.likes)

    return(
      <div>
        <h2>blogs</h2>
        <Notification notification={notification} />
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
        <br />
        <Togglable buttonLabel="new note" ref={blogFormRef}>
          <BlogSubmitForm
            addBlog={handleNewBlog}
          />
        </Togglable>
        <br />
        {sortedBlogList.map(blog =>
          <Blog
            key={blog.id}
            blog={blog}
            blogLiker={handleBlogLike}
            blogDeleter={handleBlogDelete}
            showDelete={blog.user.username === user.username}/>
        )}
      </div>
    )
  }

  return (
    <>

      {!user && loginForm()}
      {user && blogList()}
    </>

  )
}

export default App