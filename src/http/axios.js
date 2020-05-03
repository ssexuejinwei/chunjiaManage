import axios from 'axios'

// import { responseCodeMap } from './constant'

axios.defaults.baseURL = 'http://124.251.4.221/course/public/index.php/index'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

axios.interceptors.request.use(config => {
  const token = localStorage.getItem('nike#token')
  if (token) {
    config.headers.token = token
  }
  return config
})

axios.interceptors.response.use(response => {
  const { data } = response
  if (data && data.code !== 0) {
    const error = new Error(data.message)
    error.response = response
    return Promise.reject(error)
  }

  return response
})
