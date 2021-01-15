import { request } from '@/plugins/request'

// 获取公共文章列表
export const getArticles = params => {
  return request({
    method: 'GET',
    url: '/api/articles',
    params
  })
}

// 获取关注的用户文章列表
export const getFeedArticles = params => {
  return request({
    method: 'GET',
    url: '/api/articles/feed',
    // Authorization: Token jwt.token.here
    // headers: {
    //   // 注意数据格式：Token空格数据Token
    //   // 先手动写死，自动处理后续介绍
    //   Authorization: `Token eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9
    //     .eyJpZCI6MTMzMjY4LCJ1c2VybmFtZSI6InNoaWd1YW5naGFpIiwiZXhwIjoxNjE1MjgyMzcxfQ
    //     ._QB6VDwPXLFSa30IScJ1q5Q_1zk5FXB99OYAKU3qMW0`
    // },
    params
  })
}

// 添加点赞
export const addFavorite = slug => {
  return request({
    method: 'POST',
    url: `/api/articles/${slug}/favorite`
  })
}

// 取消点赞
export const deleteFavorite = slug => {
  return request({
    method: 'DELETE',
    url: `/api/articles/${slug}/favorite`
  })
}

// 获取文章详情
export const getArticle = slug => {
  return request({
    method: 'GET',
    url: `/api/articles/${slug}`
  })
}

// 获取文章评论
export const getComments = slug => {
  return request({
    method: 'GET',
    url: `/api/articles/${slug}/comments`
  })
}

// 添加文章评论
export const addComment = (slug, data) => {
  return request({
    method: 'POST',
    url: `api/articles/${slug}/comments`,
    data
  })
}

// 删除文章评论
export const deleteComment = (slug, id) => {
  return request({
    method: 'DELETE',
    url: `api/articles/${slug}/comments/${id}`
  })
}

// 添加关注
export const addFollow = username => {
  return request({
    method: 'POST',
    url: `api/profiles/${ username }/follow`
  })
}

// 取消关注
export const deleteFollow = username => {
  return request({
    method: 'DELETE',
    url: `api/profiles/${ username }/follow`
  })
}