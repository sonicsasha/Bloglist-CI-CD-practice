const testUser = {
  username: "tester1",
  password: "secretword",
  name: "Testy McTester"
}

const testBlog = {
  title: "The wonders of Full Stack",
  author: "Matti Luukkainen",
  url: "fullstackopen.com"
}

Cypress.Commands.add('createUser', (userObject) => {
  cy.request({
    url: '/api/users',
    method: 'POST',
    body: userObject,
  })

  cy.visit('/')
})

Cypress.Commands.add('login', (loginInfo) => {
  cy.request({
    url: '/api/login',
    method: 'POST',
    body: loginInfo,
  }).then((response) => {
    localStorage.setItem('loggedBlogUser', JSON.stringify(response.body))
    cy.visit('/')
  })
})

Cypress.Commands.add('addBlog', (blogObject) => {
  cy.request({
    url: '/api/blogs',
    method: 'POST',
    body: blogObject,
    headers: {
      'Authorization': `Bearer ${JSON.parse(localStorage.getItem('loggedBlogUser')).token}`
    }
  })

  cy.visit('/')
})

describe('Note ', function() {
  this.beforeEach(function () {
    cy.request('POST', '/api/testing/reset')
    cy.wait(1000)
    cy.visit('')
  })

  it('Login form is shown', function() {
    cy.contains('username')
    cy.contains('password')
    cy.contains('login')
  })

  describe('Login', function() {
    beforeEach(function () {
      cy.createUser(testUser)
    })

    it('succeeds with correct credentials', function() {
      cy.get('#usernameInput').type("tester1")
      cy.get('#passwordInput').type("secretword")
      cy.contains('login').click()
      cy.contains(`${testUser.name} logged in`)
      cy.should('not.contain', 'Log in to application')
    })

    it('fails with wrong credentials', function() {
      cy.get('#usernameInput').type("tester1")
      cy.get('#passwordInput').type('wrong')
      cy.contains('login').click()
      cy.contains('Wrong credentials!')
      cy.should('not.contain', `${testUser.name} logged in`)
    })
  })

  describe('When logged in', function() {
    this.beforeEach(function() {
      cy.createUser(testUser)
      cy.login(testUser)
    })

    it('A blog can be created', function() {
      cy.contains('new note').click()
      cy.get('#titleInput').type(testBlog.title)
      cy.get('#authorInput').type(testBlog.author)
      cy.get('#urlInput').type(testBlog.url)
      cy.contains('create').click()
      cy.get('.blogStyle').contains(testBlog.title)

    })

    
  })

  describe('When logged in and a blog created', function() {
    this.beforeEach(function() {
      cy.createUser(testUser)
      cy.login(testUser)
      cy.addBlog(testBlog)
    })

    it('A blog can be liked', function() {
      cy.contains('view').click()
      cy.contains('likes 0')
      cy.should('not.contain', 'likes 1')
      cy.contains('like').click()
      cy.contains('likes 1')
      cy.should('not.contain', 'likes 0')
    })

    it('A blog can be deleted', function() {
      cy.contains(testBlog.title)
      cy.contains('view').click()
      cy.contains('delete').click()
      cy.should('not.contain', testBlog.title)
    })

    it('Only the person who added the blog can see the delete button', function () {
      cy.contains('view').click()
      cy.contains('delete')

      const secondUser = {
        name: "Unknown Tester",
        username: "mysteryman",
        password: "salainen"
      }

      cy.createUser(secondUser)
      cy.login(secondUser)

      cy.contains('view').click()
      cy.should('not.contain', 'delete')
    })

    it('Blogs are correctly sorted according to likes', function () {
      const secondBlog = {
        title: 'Why you should keep your console open',
        author: "Harri Kähkönen",
        url: 'https://youtu.be/wqeGPX7TRv0?si=iC989ytVwlM1P4A1'
      }

      cy.addBlog(secondBlog)

      cy.get('.blogStyle').contains(testBlog.title).as('Blog1')
      cy.get('.blogStyle').contains(secondBlog.title).as('Blog2')

      cy.get('@Blog1').contains('view').click()
      cy.get('@Blog1').contains('like').click().as('ClickLikeButton')

      cy.log('Checking like positions...')

      cy.get('@Blog1').then(Blog1Element => {
        cy.get('@Blog2').then(Blog2Element => {
          expect(Blog1Element.position().top).lessThan(Blog2Element.position().top)
        })
      })

      cy.log("First position check cleared")

      cy.get('@Blog2').contains('view').click()
      cy.get('@Blog2').contains('like').click()
      cy.wait(1000)
      cy.get('@Blog2').contains('like').click()
      cy.wait(1000)

      cy.get('@Blog1').then(Blog1Element => {
        cy.get('@Blog2').then(Blog2Element => {
          expect(Blog2Element.position().top).lessThan(Blog1Element.position().top)
        })
      })
    })
  })
})