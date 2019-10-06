import { useState, useEffect } from 'react'
import axios from 'axios'

export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

export const useResource = (baseUrl) => {
    const [resources, setResources] = useState([])
    let token = null

    const setToken = newToken => {
        token = `bearer ${newToken}`
    }

    useEffect(() => {
        
          getAll()
          .then(resources => setResources(resources))
      }, [])

    const getAll = () => {
        const request = axios.get(baseUrl)
        return request.then(response => response.data)
    }
    const create = async (resource) => {
        const config = {
            headers: { Authorization: token },
          }
        const response = await axios.post(baseUrl, resource, config)
        return response.data
    }

    const update = async (id, resource) => {
    
        console.log(`${ baseUrl}/${id}`, resource)
        const response = await axios.put(`${ baseUrl}/${id}`, resource)
      
        return response.data
      }
      
      const deleteBlog = async (id) => {
        const config = {
          headers: { Authorization: token },
        }
        console.log(`${baseUrl}/${id}`, config)
        axios.delete(`${baseUrl}/${id}`, config)
      }
      
      
    
    const service = {
      setToken,
      getAll,
      create,
      update,
      deleteBlog

    }
    return [
      resources, service
    ]
  }
  
  
  
  
export const useAnotherHook = () => {
  // ...
}