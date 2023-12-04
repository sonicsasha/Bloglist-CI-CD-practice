const blogsRouter = require('express').Router()
const { random } = require('lodash')
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', (request, response) => {
    Blog
      .find({})
      .populate('user', {username: 1, name: 1})
      .then(blogs => {
        response.json(blogs)
      })
  })
  
blogsRouter.post('/', userExtractor, async (request, response) => {
    const user = request.user

    if (!user) {
      return response.status(401).json("You need to login to add a new blog")
    }

    const blog = new Blog({
      title: request.body.title || null,
      url: request.body.url || null,
      author: request.body.author || null,
      likes: request.body.likes || null
    })
    if (!blog.title || !blog.url){
      response.status(400).json({
        error: "Please make sure that your entry includes the title and the url"
      })
      return
    }

    blog.user = user.id

    if (!blog.likes) {
      blog.likes = 0
    }
  
    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
  })

blogsRouter.delete('/:id', userExtractor, async (request, response, next) => {
  const user = request.user

  const blog = await Blog.findById(request.params.id)

  if (!user || user._id.toString() !== blog.user.toString() ){
    return response.status(401).json({error: "You do not have the authorization to remove this blog"})
  }

  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()

})

blogsRouter.put('/:id', userExtractor, async (request, response, next) => {
  const id = request.params.id

  await null

  try {
  const newBlogInfo = {
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes
  }

   const updatedNote = await Blog.findByIdAndUpdate(id, newBlogInfo, {new: true, runValidators: true, context: 'query'})
   response.status(200).json(updatedNote)

  } catch(error) {
    next(error)
  }
})

module.exports = blogsRouter