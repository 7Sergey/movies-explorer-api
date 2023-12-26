const CLIENT_ERROR_CODE = 400
const UNAUTHORIZED_ERROR_CODE = 401
const FORBIDDEN_ERROR_CODE = 403
const NOT_FOUND_ERROR_CODE = 404
const CONFLICT_ERROR_CODE = 409
const SERVER_ERROR_CODE = 500

const SALT_ROUNDS = 10
const MONGO_DUPLICATE_ERROR_CODE = 11000

module.exports = {
  NOT_FOUND_ERROR_CODE,
  CLIENT_ERROR_CODE,
  UNAUTHORIZED_ERROR_CODE,
  SERVER_ERROR_CODE,
  CONFLICT_ERROR_CODE,
  SALT_ROUNDS,
  MONGO_DUPLICATE_ERROR_CODE,
  FORBIDDEN_ERROR_CODE,
}
