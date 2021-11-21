import request from '@/utils/request'

/**
* 用户名密码登录
* @param {String} account - 账号
* @param {String} password - 密码
* @return: Promise
*/
export const accountLogin = ({ account, password }) => {
  return request('/login', 'post', { account, password })
}

/**
* 手机短信验证码
* @param {Number} mobile - 手机号
* @return: Promise
*/
export const getLoginCode = mobile => {
  return request('/login/code', 'get', { mobile })
}

/**
* 手机号登录
* @param {String} mobile - 手机号
* @param {String} code - 验证码
* @return: Promise
*/
export const mobileLogin = ({ mobile, code }) => {
  return request('/login/code', 'post', { mobile, code })
}

// 1、当前文件是与用户相关的接口
