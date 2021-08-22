import request from '@/utils/request'

// 创建迭代
export function createIteration(data) {
  return request({
    url: '/pro/iteration/create',
    method: 'post',
    data
  })
}

// 更新迭代
export function editIteration(data) {
  return request({
    url: '/pro/iteration/edit',
    method: 'post',
    data
  })
}

// 删除迭代
export function deleteIteration(data) {
  return request({
    url: '/pro/iteration/delete',
    method: 'post',
    data
  })
}
