const lodash = require('lodash')

const dummy = (blogs) => {
    return 1
  }
  
const totalLikes = (blogs) => {
    const likeCounter = (total, currentBlog) => {
        return total + currentBlog.likes
    }

    return blogs.length === 0
    ? 0
    : blogs.reduce(likeCounter, 0)
}

const favoriteBlog = (blogs) => {
    let favoriteBlog = null

    blogs.forEach(blog => {
        if (favoriteBlog === null || blog.likes > favoriteBlog.likes) {
            favoriteBlog = blog
        }
    })

    return favoriteBlog === null 
    ? null
    : {
        title: favoriteBlog.title,
        author: favoriteBlog.author,
        likes: favoriteBlog.likes
    }
}

const mostBlogs = (blogs) => {
    const blogCounter = lodash.countBy(blogs, (blog) => blog.author)

    let mostPopularBlogger = null

    lodash.forEach(blogCounter, (value, key) => {
        if (mostPopularBlogger === null || value > mostPopularBlogger.blogs)
        {
            mostPopularBlogger = {
                author: key,
                blogs: value
            }
        }
    })

    return mostPopularBlogger
}

const mostLikes = (blogs) => {
    let likeCounter = lodash.reduce(blogs, (result, blog) => {
        if (!result[blog.author]){
            result[blog.author] = 0
        }
        result[blog.author] += blog.likes
        return result
    }, {})

    let mostLikes = null

    likeCounter = lodash.forEach(likeCounter, (likes, author) => {
        if (mostLikes === null || likes > mostLikes.likes) {
            mostLikes = {
                author: author,
                likes: likes
            }
        }
    })
    
    return mostLikes
}

  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
  }