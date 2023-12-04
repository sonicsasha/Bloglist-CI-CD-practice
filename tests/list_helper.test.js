const listHelper = require('../utils/list_helper')

const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]

  const blogs = [
    {
      _id: "5a422a851b54a676234d17f7",
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7,
      __v: 0
    },
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0
    },
    {
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0
    },
    {
      _id: "5a422b891b54a676234d17fa",
      title: "First class tests",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
      likes: 10,
      __v: 0
    },
    {
      _id: "5a422ba71b54a676234d17fb",
      title: "TDD harms architecture",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
      likes: 0,
      __v: 0
    },
    {
      _id: "5a422bc61b54a676234d17fc",
      title: "Type wars",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 2,
      __v: 0
    }  
  ]


test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('Total likes', () => {
    
    test('of empty list is zero', () => {
        expect(listHelper.totalLikes([])).toBe(0)
    })

    test('when list has only one blog equals the likes of that', () => {
        expect(listHelper.totalLikes(listWithOneBlog)).toBe(5)
    })

    test('of a bigger list is calculated right', () => {
        expect(listHelper.totalLikes(blogs)).toBe(36)
    })
})

describe('Favorite blog', () => {
    test('of empty list returns null', () => {
        expect(listHelper.favoriteBlog([])).toBeNull()
    })

    test('of a list with one blog to return the single blog', () => {
        const expectedOutput = {
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            likes: 5
        }

        expect(listHelper.favoriteBlog(listWithOneBlog)).toEqual(expectedOutput)
    })

    test('of a longer list to return the correct value', () => {
        const expectedOutput = {
            title: "Canonical string reduction",
            author: "Edsger W. Dijkstra",
            likes: 12
        }

        expect(listHelper.favoriteBlog(blogs)).toEqual(expectedOutput)

    })
})

describe('Most blogs', () => {
  test('of an empty list returns null', () => {
    expect(listHelper.mostBlogs([])).toBeNull()
  })

  test('of a list with a single element to return correct value', () => {
    const expectedOutput = {
      author: 'Edsger W. Dijkstra',
      blogs: 1
    }
    expect(listHelper.mostBlogs(listWithOneBlog)).toEqual(expectedOutput)
  })

  test('of a longer list returns the correct value', () => {
    const expectedOutput = {
      author: "Robert C. Martin",
      blogs: 3
    }

    expect(listHelper.mostBlogs(blogs)).toEqual(expectedOutput)
  })
})

describe('Most likes', () => {
  test('on an empty list to be null', () => {
    expect(listHelper.mostLikes([])).toBeNull()
  })

  test('on a list with one blog to return correct value', () => {
    const expectedOutput = {
      author: "Edsger W. Dijkstra",
      likes: 5
  }

    expect(listHelper.mostLikes(listWithOneBlog)).toEqual(expectedOutput)
  }) 

  test('on a list of multiple blogs returns the correct value', () => {
    const expectedOutput = {
      author: "Edsger W. Dijkstra",
      likes: 17
    }

    expect(listHelper.mostLikes(blogs)).toEqual(expectedOutput)
  })

})
