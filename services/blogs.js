import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async resource => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, resource, config) 
  return response.data
}

const update = async (id, newObject) => {
  
  console.log(`${ baseUrl}/${id}`, newObject)
  const response = await axios.put(`${ baseUrl}/${id}`, newObject)

  return response.data
}

const deleteBlog = async (id) => {
  const config = {
    headers: { Authorization: token },
  }
  console.log(`${baseUrl}/${id}`, config)
  axios.delete(`${baseUrl}/${id}`, config)
}

export default { getAll, create, update, setToken, deleteBlog } 


