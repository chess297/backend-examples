export * from './enums';

export const __IS_DEV__ = process.env.NODE_ENV !== 'production';

/**
 * 响应码
 */
export const API_CODES = {
  OK: 200,
  BAD_REQUEST: 400,
  UNKNOWN: 99999,
  USER_EXIST: 40001,
  USER_NO_EXIST: 40002,
  USER_PASSWORD_ERR: 40003,
  AUTH_ERR: 50001,
};

/**
 * 响应信息
 */
export const API_MSGS = {
  [API_CODES.OK]: '成功',
  [API_CODES.BAD_REQUEST]: '请求错误',
  [API_CODES.UNKNOWN]: '未知错误',
  [API_CODES.USER_EXIST]: '用户已存在',
  [API_CODES.USER_NO_EXIST]: '用户不存在',
  [API_CODES.USER_PASSWORD_ERR]: '用户密码错误',
  [API_CODES.AUTH_ERR]: '认证失败',
};

export const APP_NAME = 'nestjs-example';
