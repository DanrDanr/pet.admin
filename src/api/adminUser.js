import request from '@/utils/request'

export function adminLogin(data) {
  return request({
    url: '/api/login',
    method: 'post',
    data
  })
}
