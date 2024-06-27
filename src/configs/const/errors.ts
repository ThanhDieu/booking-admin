export default {
  ERR: 'error',
  AUTH_MISS: 'authorization header is missing',

  INVALID_TOKEN: 'invalid token',

  SS_OVER: 'session is overridden',

  SS_NOTFOUND: 'session not found',
  RECORD_NOTFOUND: 'record not found',

  INVALID_SSID: 'invalid session id',

  HTTP_NAMED: 'http: named cookie not present',

  TOKEN_EXP: 'token is expired',

  ACTION_ACL: 'action is not allowed in acl',

  INVALID_CREDEN: 'invalid credentials',

  EOF: 'EOF',
  NO_PERMISSION: 'user has no permission',
  ACC_EXISTS: 'account already exists',
} as const;
