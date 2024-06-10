import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import { Loading } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// Request instance
const instance = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 60000
})

// Request pre-filter
instance.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['token'] = getToken()
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// Response data interception and common processing
instance.interceptors.response.use(
  response => {
    const res = response.data

    // Return directly for downloading files
    if (res.type === 'application/octet-stream') {
      return response
    }

    if (res.type === 'application/vnd.ms-excel') {
      return response
    }

    // 0 is the correct response code
    if (res.code !== 0) {
      Message({
        message: res.msg || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // Login timeout response code
      if (res.code === 10010002) {
        // to re-auth
        MessageBox.confirm('Session expired, please log in again!', 'Login prompt', {
          confirmButtonText: 'Log in again',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      return res
    }
  },
  error => {
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

/**
 * Upload
 * @param url
 * @param data
 */
export function upload(url, file, data) {
  const formData = new FormData()
  formData.append('file', file)

  // Append data
  if (data) {
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key])
    })
  }

  return new Promise((resolve, reject) => {
    // Open
    const loading = Loading.service({
      text: 'Uploading data...',
      background: 'rgba(0, 0, 0, 0.7)'
    })

    instance.request({
      url: url,
      method: 'post',
      data: formData,
      timeout: 1200000
    }).then(response => {
      loading.close()
      resolve(response)
    }).catch(err => {
      loading.close()
      reject(err)
    })
  })
}

/**
 * Download
 * @param url
 * @param data
 */
export function download(url, data, fileName) {
  return new Promise((resolve, reject) => {
    // Open
    const loading = Loading.service({
      text: 'Downloading data...',
      background: 'rgba(0, 0, 0, 0.7)'
    })

    instance.request({
      url: url,
      method: 'post',
      data: data,
      timeout: 1200000,
      responseType: 'blob'
    }).then(res => {
      loading.close()

      // File download
      const blob = new Blob([res.data], {
        type: 'application/vnd.ms-excel'
      })

      // Get file name
      let link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.setAttribute('download', fileName)
      link.click()
      link = null
      Message.success('Export successful!')
    }).catch(err => {
      loading.close()
      reject(err)
    })
  })
}

/**
 * Encapsulate post request
 * @param url
 * @param data
 * @returns {Promise}
 */
export function post(url, data = {}) {
  return new Promise((resolve, reject) => {
    instance.post(url, data)
      .then(response => {
        resolve(response)
      }, err => {
        reject(err)
      })
  })
}
