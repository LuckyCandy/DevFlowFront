import request from '@/utils/request'

// 登录
export function login(data) {
  return request({
    url: '/auth/login',
    method: 'post',
    data
  })
}

// 个人信息
export function getInfo(token) {
  return request({
    url: '/my/profile',
    method: 'get',
    params: { token }
  })
}

export function changePassword(data) {
  return request({
    url: '/my/change/password',
    method: 'post',
    data
  })
}

// 登出
export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post'
  })
}

// dashboard
export function dashboard() {
  return request({
    url: '/dashboard',
    method: 'get'
  })
}

// 拉取工作流
export function getWorkflow() {
  return request({
    url: '/my/workflow',
    method: 'get'
  })
}
// 更新工作流
export function updateWorkflow(data) {
  return request({
    url: '/my/workflow',
    method: 'post',
    data
  })
}

