import { useState } from 'react'
import PropTypes from 'prop-types'

const BlogSubmitForm = ({ addBlog }) => {
  const [newBlogObject, setNewBlogObject] = useState({
    title: '',
    author: '',
    url: ''
  })

  const handleSubmit = async (event) => {
    event.preventDefault()
    await addBlog(newBlogObject)
    setNewBlogObject({
      title: '',
      author: '',
      url: ''
    })
  }

  return (
    <div>
      <h2>Create new</h2>
      <form onSubmit={handleSubmit}>
        title: <input
          type="text"
          value={newBlogObject.title}
          onChange={({ target }) => {setNewBlogObject({ ...newBlogObject, title: target.value })}}
          name="textInput"
          id='titleInput'
        />
        <br/>

        author: <input
          type="text"
          value={newBlogObject.author}
          onChange={({ target }) => setNewBlogObject({ ...newBlogObject, author: target.value })}
          id='authorInput'
        />
        <br/>


        url: <input
          type="text"
          value={newBlogObject.url}
          onChange={({ target }) => setNewBlogObject({ ...newBlogObject, url: target.value })}
          id='urlInput'
        />
        <br />

        <button type="submit">
            create
        </button>
      </form>
    </div>
  )}

BlogSubmitForm.propTypes = {
  addBlog: PropTypes.func.isRequired
}

export default BlogSubmitForm