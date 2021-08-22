import request from '@/utils/request'

// 开发提交估时
export function devSubmitDuration(data) {
  return request({
    url: '/dev/iteration/duration/submit',
    method: 'post',
    data
  })
}

// 测试提交估时
export function tstSubmitDuration(data) {
  return request({
    url: '/tst/iteration/duration/submit',
    method: 'post',
    data
  })
}

// 估时详情
export function durationDetail(query) {
  return request({
    url: '/iteration/duration/detail',
    method: 'get',
    params: query
  })
}
