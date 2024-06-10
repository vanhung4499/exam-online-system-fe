import request from '@/utils/request'

export function exercisePaging(params) {
  return request({
    url: 'exercises/getRepo',
    method: 'get',
    params
  })
}

export function getQuestion(params, repoId) {
  return request({
    url: 'exercises/' + repoId,
    method: 'get',
    params
  })
}

export function getQuestionDetail(id) {
  return request({
    url: `exercises/question/${id}`,
    method: 'get'
  })
}

export function submitAnswer(data) {
  return request({
    url: `exercises/fillAnswer`,
    method: 'post',
    data
  })
}

