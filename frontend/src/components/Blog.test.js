import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import BlogSubmitForm from './BlogSubmit'

const testBlog = {
  title: 'Testing notes',
  author: 'Mr. Tester',
  url: 'helsinki.fi',
  likes: 0,
  user: {
    name: 'Tester Testerson',
    username: 'testerson23'
  }
}

test('Blog renders the title', () => {
  const { container } = render(<Blog blog={testBlog} />)

  const div = container.querySelector('.blogStyle')
  screen.debug(div)
  expect(div).toHaveTextContent(
    testBlog.title
  )
})

test('Blog shows additional information when clicked on more information', async () => {
  const { container } = render(<Blog blog={testBlog} />)

  const user = userEvent.setup()

  const showButton = container.querySelector('#dropdownToggler')
  const dropdownContent = container.querySelector('#dropdownContent')

  expect(dropdownContent).not.toBeVisible()

  expect(dropdownContent).toHaveTextContent(testBlog.url)
  expect(dropdownContent).toHaveTextContent(testBlog.likes)
  expect(dropdownContent).toHaveTextContent(testBlog.user.name)

  await user.click(showButton)

  expect(dropdownContent).toBeVisible()
})

test('Like button event is called correctly when it is clicked', async () => {
  const mockHandler = jest.fn()

  const { container } = render(<Blog blog={testBlog} blogLiker={mockHandler}/>)

  const user = userEvent.setup()

  const likeButton = container.querySelector('#likeButton')

  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})

test('BlogSubmit form passes the correct values as parameters', async () => {
  const user = userEvent.setup()

  const addBlogHandler = jest.fn()

  const { container } = render(<BlogSubmitForm addBlog={addBlogHandler}/>)

  const titleInput = container.querySelector('#titleInput')
  const authorInput = container.querySelector('#authorInput')
  const urlInput = container.querySelector('#urlInput')
  const submitButton = screen.getByRole('button')

  await user.type(titleInput, testBlog.title)
  await user.type(authorInput, testBlog.author)
  await user.type(urlInput, testBlog.url)
  await user.click(submitButton)

  const expectedOutput = {
    title: testBlog.title,
    author: testBlog.author,
    url: testBlog.url
  }

  expect(addBlogHandler.mock.calls[0][0]).toEqual(expectedOutput)
})