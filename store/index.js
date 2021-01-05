const cookieparser = process.server ? require
('cookieparser') : undefined

// 在服务端渲染期间运行的都是同一个实例
// 为了防止数据冲突
// 务必将 state 定义成一个函数，返回数据对象
export const state = () => {
  return {
    // 当前登录用户的登录状态
    user: null
  }
}

export const mutations = {
  setUser (state, data) {
    state.user = data
  }
}

export const actions = {
  // nuxtServerInit 是一个特殊的 action 方法
  // 这个 action 会在服务端渲染期间自动调用
  // 作用：初始化容器数据，传递数据给客户端使用

  // commit：用来提交 mutation 的 commit 方法
  // req：服务端渲染期间的 request 请求对象
  nuxtServerInit ({ commit }, { req }) {
    let user = null

    // 如果请求头中有 Cookie
    if (req.headers.cookie) {
      // 将请求头中的 Cookie 字符串解析为一个对象
      const parsed = cookieparser.parse(req.headers.cookie)
      try {
        // 将 user 还原为 JavaScript 对象
        user = JSON.parse(parsed.user)
      } catch (error) {
        // No valid cookie found
      }
    }

    // 提交 mutation 修改 state 状态
    commit('setUser', user)
  }    
}
