import request from '@/utils/request'

export function registerShop(data) {
  return request({
    url: '/api/shop/register',
    method: 'post',
    data
  })
}
export function shopList() {
  return request({
    url: '/api/shop/list',
    method: 'get'
  })
}

export function paginationList(params) {
  return request({
    url: '/api/shop/paginationList',
    method: 'post',
    params: params
  })
}
export function edit(data) {
  return request({
    url: '/api/shop/edit',
    method: 'post',
    data
  })
}
export function pass(data) {
  return request({
    url: '/api/shop/edit',
    method: 'post',
    data
  })
}
export function refuse(data) {
  return request({
    url: '/api/shop/refuse',
    method: 'post',
    data
  })
}
export function remove(data) {
  return request({
    url: '/api/shop/remove',
    method: 'post',
    data
  })
}

