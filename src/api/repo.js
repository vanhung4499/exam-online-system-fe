import request from '@/utils/request'

export function repoAdd(data) {
  return request({
    url: 'repo',
    method: 'post',
    data
  })
}

export function repoPaging(params) {
  return request({
    url: 'repo/paging',
    method: 'get',
    params
  })
}

export function repoDel(id) {
  return request({
    url: 'repo/' + id,
    method: 'delete'
  })
}

export function repoUpdate(id, data) {
  return request({
    url: 'repo/' + id,
    method: 'put',
    data
  })
}

export function getListRepoPaging(params) {
  return request({
    url: 'repo/list',
    method: 'get',
    params
  })
}
