/**
 * 基于 axios 封装的请求模块
 */

import axios from 'axios'

const request = axios.create({
  baseURL: 'https://conduit.productionready.io/'
})

export default request
