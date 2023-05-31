export const COMMENTS_ON_PAGE = 25
let API_URL, WEBSOCKET_API_URL, HEALTH_CHECK_URL

const apiDomain = 'optimised-comments.onrender.com'

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  API_URL = `http://localhost:5000/api`
  WEBSOCKET_API_URL = 'ws://localhost:5000'
  HEALTH_CHECK_URL = 'http://localhost:5000'
} else {
  API_URL = `https://${apiDomain}/api`
  WEBSOCKET_API_URL = `wss://${apiDomain}`
  HEALTH_CHECK_URL = `https://${apiDomain}`
}

export const MAX_FILES_IN_COMMENT = 2

export {API_URL, WEBSOCKET_API_URL, HEALTH_CHECK_URL}

