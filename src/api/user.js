import request from '@/utils/request'

export function classAdd(data) {
  return request({
    url: 'user',
    method: 'post',
    data
  })
}

export function login(data) {
  return request({
    url: 'auths/login',
    method: 'post',
    data
  })
}
export function verifyCode(code) {
  return request({
    url: 'auths/verifyCode/' + code,
    method: 'post'
  })
}

export function getInfo() {
  return request({
    url: 'user/info',
    method: 'get'

  })
}

export function logout() {
  return request({
    url: '/auths/logout',
    method: 'delete'
  })
}

export function userPaging(params) {
  return request({
    url: 'user/paging',
    method: 'get',
    params
  })
}
export function userDel(ids) {
  return request({
    url: 'user/' + ids,
    method: 'delete'
  })
}
export function userImport(data) {
  return request({
    url: 'user/import',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  })
}

export function changePassword(data) {
  return request({
    url: 'user',
    method: 'put',
    data
  })
}

export function userAddClass(params) {
  return request({
    url: 'user/grade/join',
    method: 'put',
    params
  })
}

export function register(data) {
  return request({
    url: 'auths/register',
    method: 'post',
    data
  })
}
export function trackPresence(data) {
  return request({
    url: 'auths/track-presence',
    method: 'post',
    data
  })
}

export function uploadAvatar(data) {
  return request({
    url: 'user/uploadAvatar',
    method: 'put',
    data
  })
}
