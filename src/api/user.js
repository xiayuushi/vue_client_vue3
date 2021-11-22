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

/**
* QQ登录
* @param {String} unionId - 第三方登录惟一标识 （QQ登录SDK中OpenAPI获取的openId）
* @param {Number} source -  注册来源，1为pc，2为webapp，3为微信小程序，4为Android，5为ios，6为qq，7为微信
* @return: Promise
*/
export const userQQLogin = (unionId, source = 6) => {
  return request('/login/social', 'post', { unionId, source })
}

// 1、当前文件是与用户相关的接口
