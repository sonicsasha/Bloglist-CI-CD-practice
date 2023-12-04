const bcrypt = require('bcrypt')
const User = require('../models/user')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')
const { default: mongoose } = require('mongoose')
const api = supertest(app)

describe('When there are no users in the database', () => {
    beforeEach(async ()=> {
        await User.deleteMany({})
    })

    test('Can create a new user', async () => {
        const newUser = {
            username: "tester23",
            password: "SalainenSana",
            name: "Testy McTester"
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)

        const usersInDB = await helper.getUsersInDB()

        expect(usersInDB.length).toEqual(1)
    })

    test('Cannot create a user without username', async () => {
        const newUser = {
            password: "SalainenSana",
            name: "Testy McTester"
        }

        const response = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
        
        expect(response.body.error).toEqual("User validation failed: username: Path `username` is required.")

        const usersInDB = await helper.getUsersInDB()
        expect(usersInDB.length).toBe(0)
    })
    test('Cannot create a user without password', async () => {
        const newUser = {
            username: "testy123",
            name: "Testy McTester"
        }

        const response = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
        
        expect(response.body.error).toEqual("Password is required!")
        const usersInDB = await helper.getUsersInDB()
        expect(usersInDB.length).toBe(0)
    })
    test('Cannot create a user with a short password', async () => {
        const newUser = {
            username: "testy123",
            password: "aa",
            name: "Testy McTester"
        }

        const response = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
        
        expect(response.body.error).toEqual("Please enter a password that is at least 3 characters long")
        const usersInDB = await helper.getUsersInDB()
        expect(usersInDB.length).toBe(0)
    })

    test('Cannot create multiple users with the same username', async () => {
        const firstUser = {
            username: "tester23",
            password: "SalainenSana",
            name: "Testy McTester"
        }

        await api
            .post('/api/users')
            .send(firstUser)
            .expect(201)

        const secondUser = {
            username: "tester23",
            password: "MikroMobiili",
            name: "Test von Tester"
        }

        const response = await api
            .post('/api/users')
            .send(secondUser)
            .expect(400)
        
        expect(response.body.error).toEqual("User validation failed: username: Error, expected `username` to be unique. Value: `tester23`")
        const usersInDB = await helper.getUsersInDB()
        expect(usersInDB.length).toBe(1)
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})