import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const addEntry = async (newBlogObject) => {
  const config = {
    headers: { Authorization: token }
  }

  const request = await axios.post(baseUrl, newBlogObject, config)
  return request.data
}

const updateEntry = async (id, updatedBlogObject) => {
  const config = {
    headers: { Authorization: token }
  }

  const request = await axios.put(`${baseUrl}/${id}`, updatedBlogObject, config)
  return request.data
}

const removeEntry = async (blogObject) => {
  const config = {
    headers: { Authorization: token }
  }

  const request = await axios.delete(`${baseUrl}/${blogObject.id}`, config)
  return request
}

export default { getAll, setToken, addEntry, updateEntry, removeEntry }