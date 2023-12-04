const mongoose = require('mongoose')
const supertest  = require('supertest')
const lodash = require('lodash')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
let userToken = null

beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const newUser = {
        name: "Test User",
        username: "tester",
        password: "secret123"
    }

    await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
    
    const loginResponse = await api
        .post('/api/login')
        .send(newUser)
        .expect(200)
    

    userToken = `Bearer ${loginResponse.body.token}`

    for (const blog of helper.initialBlogs)
    {
        await api
            .post('/api/blogs')
            .set('Authorization', userToken)
            .send(blog)
            .expect(201)
            }
})

test('All blogs are returned correctly', async () => {
    const response = await api
        .get('/api/blogs')
        .set('Authorization', userToken)

    expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('Returned blog entries do not have an _id field', async() => {
    const blogsContent = await helper.getBlogsInDB()
    expect(blogsContent[0].id).toBeDefined()
    expect(blogsContent[0]._id).not.toBeDefined()
})

test('Adding a blog without user token results in error', async () => {
    const newEntry = {
        title: "The wonders of Full Stack",
        author: "Matti Luukkainen",
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        likes: 100
    }

    await api
        .post('/api/blogs')
        .send(newEntry)
        .expect(401)
    
    const blogsNow = await helper.getBlogsInDB()

    expect(blogsNow).toHaveLength(helper.initialBlogs.length)
})

test('Can add new blogs to the list', async () => {
    const newEntry = {
        title: "The wonders of Full Stack",
        author: "Matti Luukkainen",
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        likes: 100
    }

    await api
        .post('/api/blogs')
        .set('Authorization', userToken)
        .send(newEntry)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
    const blogsNow = await helper.getBlogsInDB()

    expect(blogsNow).toHaveLength(helper.initialBlogs.length + 1)
    expect(blogsNow.map(r => r.title)).toContain("The wonders of Full Stack")
})

test('Adding a blog entry without likes sets the likes counter to 0', async () =>{
    const newEntry = {
        title: "The wonders of Full Stack",
        author: "Matti Luukkainen",
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    }

    const submittedEntry = await api
        .post('/api/blogs')
        .set('Authorization', userToken)
        .send(newEntry)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    expect(submittedEntry.body.likes).toBeDefined()
    expect(submittedEntry.body.likes).toEqual(0)
})

test('Adding a blog without title results in error', async () => {
    const newEntry = {
        author: "Matti Luukkainen",
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    }

    await api
        .post('/api/blogs')
        .set('Authorization', userToken)
        .send(newEntry)
        .expect(400)
})

test('Adding a blog without url results in error', async () => {
    const newEntry = {
        title: "The wonders of Full Stack",
        author: "Matti Luukkainen",
    }

    await api
        .post('/api/blogs')
        .set('Authorization', userToken)
        .send(newEntry)
        .expect(400)
})

test('Can succesfully delete', async () => {
    const blogs = await helper.getBlogsInDB()
    const blogToDelete = blogs[0]

    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', userToken)
        .expect(204)
    
    newBlogs = await helper.getBlogsInDB()
    
    expect(newBlogs.length).toEqual(helper.initialBlogs.length-1)
    expect(newBlogs).not.toContain(blogToDelete)

})

test('Can succesfully update blog entry', async () => {
    const blogs = await helper.getBlogsInDB()
    const blogToUpdate = blogs[0]

    const updatedBlog = {
        title: "Updated Entry",
        author: blogToUpdate.author,
        url: blogToUpdate.url,
        likes: blogToUpdate.likes + 1,
    }

    const response = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .set('Authorization', userToken)
        .send(updatedBlog)
        .expect(200)
    

    const newBlogs = await helper.getBlogsInDB()

    expect(JSON.stringify(newBlogs)).toContain(JSON.stringify(response.body))
    expect(newBlogs).not.toContain(blogToUpdate)
    expect(response.body.likes).toEqual(updatedBlog.likes)
    expect(response.body.title).toEqual("Updated Entry")
})

afterAll(async () => {
    await mongoose.connection.close()
  })