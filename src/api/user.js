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

/**
* QQ绑定账号时的短信验证码
* @param {String} mobile - 手机号
* @return: Promise
*/
export const userQQBindCode = mobile => {
  return request('/login/social/code', 'get', { mobile })
}

/**
* QQ登录绑定账号
* @param {String} unionId - 第三方登录惟一标识 （QQ登录SDK中OpenAPI获取的openId）
* @param {String} mobile - 手机号
* @param {String} code - 验证码
* @return: Promise
*/
export const userQQbindAccount = ({ unionId, mobile, code }) => {
  return request('/login/social/bind', 'post', { unionId, mobile, code })
}

/**
* 验证注册账号惟一性
* @param {String} account - 用户名
* @return: Promise
*/
export const userAccountCheck = account => {
  return request('/register/check', 'get', { account })
}

/**
* 注册时获取短信验证码
* @param {Number} mobile - 手机号
* @return: Promise
*/
export const registerCode = mobile => {
  return request('/register/code', 'get', { mobile })
}

/**
 * QQ登录-完善信息
 * @param {String} unionId - QQ唯一标识，openId
 * @param {String} mobile - 手机号
 * @param {String} code - 验证码
 * @param {String} account - 帐号
 * @param {String} password - 密码
 * @returns
 */
export const userQQPatchLogin = ({ unionId, mobile, code, account, password }) => {
  return request(`/login/social/${unionId}/complement`, 'post', { mobile, code, account, password })
}

// 1、当前文件是与用户相关的接口
