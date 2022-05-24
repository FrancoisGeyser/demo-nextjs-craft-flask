import axios from 'axios'
import nookies from 'nookies'

const request = async (url: string, args: {}) => {
  const baseUrl = 'http://localhost:5000'
  const dataToSend = {
    url: baseUrl + url,
    xsrfCookieName: 'x-csrftoken',
    xsrfHeaderName: 'x-csrftoken',
    withCredentials: true,
    headers: {
      credentials: 'same-origin',
    },
    ...args,
  }
  const csrf = nookies.get({}, 'x-csrftoken')
  if (csrf) {
    axios.defaults.headers.post['x-csrftoken'] = csrf
  } else {
     const {headers} =  await request('/api/getcsrf',{method: 'GET'})
  if (headers['x-csrftoken']) {
    axios.defaults.headers.post['x-csrftoken'] = headers['x-csrftoken']
    nookies.set({}, 'x-csrftoken', headers['x-csrftoken'], {
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    })
  }}

  const dataReturned = await axios(dataToSend)
  const { data, headers } = await dataReturned
  if (headers['x-csrftoken']) {
    nookies.set({}, 'x-csrftoken', headers['x-csrftoken'], {
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    })
  }

    if (data) {
        if (data?.login == true) {
            nookies.set({}, 'client_id', data.id)
        } else if(data?.logout == true) {
            nookies.destroy({},'client_id')
        }
    }

  return await data
}

export const API = {
  getUsers: () => {
    const args = {
      method: 'GET',
    }
    return request('/users', args)
  },
  auth: {
    getToken: () => request('/api/getcsrf', { method: 'GET' }),
    login: (dataToSend) => {
      const args = {
        method: 'POST',
        data: dataToSend,
      }
      return request('/api/login', args)
    },
    logout: () => {
      const args = {
        method: 'GET',
      }
      return request('/api/logout', args)
    },
    getSession: () => {
      const args = {
        method: 'GET',
      }
      return request('/api/getsession', args)
    },
  },
    profile: {
        update: (dataToSend) => {
            const args = {
                method: 'POST',
                data: {
                    ...dataToSend
                }            
            }
            return request('/api/user/profile',args)
        },
        getProfile: () => {
            const args = {
                method: 'GET',
            }
            return request('/api/data',args)
        }
    }
}
