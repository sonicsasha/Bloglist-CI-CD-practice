import Dropdown from './Dropdown'
import PropTypes from 'prop-types'

const Blog = ({ blog, blogLiker, blogDeleter, showDelete }) => (
  <div className="blogStyle">
    <Dropdown header={blog.title}>
      {blog.url}
      <br/>
      likes {blog.likes}
      <button onClick={() => blogLiker(blog)} id='likeButton'>like</button>
      <br/>
      {blog.user.name}
      <br/>
      {showDelete &&
        <button onClick={() => blogDeleter(blog)}>
          delete
        </button>
      }
    </Dropdown>
  </div>
)

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  blogLiker: PropTypes.func.isRequired,
  blogDeleter: PropTypes.func.isRequired,
  showDelete: PropTypes.bool.isRequired
}

export default Blog