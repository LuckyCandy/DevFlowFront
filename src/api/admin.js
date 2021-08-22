import request from '@/utils/request'

// 用户列表
export function fetchUserList(query) {
  return request({
    url: '/admin/user/search',
    method: 'get',
    params: query
  })
}

// 激活或禁用账号
export function userChangeStatus(query) {
  return request({
    url: '/admin/user/change/status',
    method: 'get',
    params: query
  })
}

// 用户密码重置
export function userPasswordReset(query) {
  return request({
    url: '/admin/user/password/reset',
    method: 'get',
    params: query
  })
}

// 创建用户
export function createUser(data) {
  return request({
    url: '/admin/user/create',
    method: 'post',
    data
  })
}

// 编辑用户
export function editUser(data) {
  return request({
    url: '/admin/user/update',
    method: 'post',
    data
  })
}
